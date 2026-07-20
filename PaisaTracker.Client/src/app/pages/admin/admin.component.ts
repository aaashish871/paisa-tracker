import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/admin.service';
import { AuthService } from '../../core/auth.service';
import { AppUser } from '../../core/auth.models';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users: AppUser[] = [];
  loading = true;
  error = '';

  showAddModal = false;
  addForm = { username: '', password: '', displayName: '', role: 'SuperUser' as 'Admin' | 'SuperUser' };

  resetTargetId: string | null = null;
  resetPassword = '';

  constructor(private admin: AdminService, public auth: AuthService) {}

  ngOnInit(): void {
    this.load();
  }

  get superUserCount(): number {
    return this.users.filter(u => u.role === 'SuperUser').length;
  }

  load() {
    this.loading = true;
    this.admin.getUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.error = 'Could not load users.'; this.loading = false; }
    });
  }

  openAdd() {
    this.addForm = { username: '', password: '', displayName: '', role: 'SuperUser' };
    this.showAddModal = true;
  }

  closeAdd() {
    this.showAddModal = false;
  }

  createUser() {
    if (!this.addForm.username.trim() || !this.addForm.password.trim()) return;
    this.admin.createUser(this.addForm).subscribe({
      next: () => { this.closeAdd(); this.load(); },
      error: (err) => alert(err.error?.message ?? 'Could not create user.')
    });
  }

  changeRole(user: AppUser, role: 'Admin' | 'SuperUser') {
    if (user.role === role) return;
    this.admin.changeRole(user.id, role).subscribe(() => this.load());
  }

  openReset(user: AppUser) {
    this.resetTargetId = user.id;
    this.resetPassword = '';
  }

  closeReset() {
    this.resetTargetId = null;
  }

  submitReset() {
    if (!this.resetTargetId || !this.resetPassword.trim()) return;
    this.admin.resetPassword(this.resetTargetId, this.resetPassword).subscribe({
      next: () => { this.closeReset(); alert('Password reset successfully.'); },
      error: (err) => alert(err.error?.message ?? 'Could not reset password.')
    });
  }

  remove(user: AppUser) {
    if (user.username === this.auth.username) {
      alert("You can't delete your own logged-in account.");
      return;
    }
    if (!confirm(`Delete user "${user.username}"? This also deletes all their data.`)) return;
    this.admin.deleteUser(user.id).subscribe(() => this.load());
  }
}
