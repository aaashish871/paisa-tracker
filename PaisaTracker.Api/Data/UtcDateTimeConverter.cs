using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace PaisaTracker.Api.Data;

/// <summary>
/// Npgsql refuses to write DateTime.Kind=Unspecified (e.g. from JSON-deserialized dates)
/// to "timestamp with time zone" columns. Treat unspecified as UTC everywhere.
/// </summary>
public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
{
    public UtcDateTimeConverter() : base(
        v => v.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(v, DateTimeKind.Utc) : v.ToUniversalTime(),
        v => DateTime.SpecifyKind(v, DateTimeKind.Utc))
    {
    }
}
