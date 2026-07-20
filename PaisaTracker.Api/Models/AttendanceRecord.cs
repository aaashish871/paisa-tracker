namespace PaisaTracker.Api.Models;

public enum AttendanceStatus
{
    Present,
    Absent,
    HalfDay
}

public class AttendanceRecord
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int WorkerId { get; set; }
    public DateTime Date { get; set; }
    public AttendanceStatus Status { get; set; }
}
