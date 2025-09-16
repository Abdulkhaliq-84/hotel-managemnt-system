using Microsoft.EntityFrameworkCore;

namespace HotelManagement.API.Models
{
    public class HotelManagementDbContext : DbContext
    {
        public HotelManagementDbContext(DbContextOptions<HotelManagementDbContext> options) : base(options)
        {
        }

        public DbSet<Guest> Guests { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure Guest entity
            modelBuilder.Entity<Guest>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
                entity.HasIndex(e => e.Email).IsUnique();
            });
            
            // Configure Room entity
            modelBuilder.Entity<Room>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RoomNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.RoomType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PricePerNight).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.HasIndex(e => e.RoomNumber).IsUnique();
            });
            
            // Configure Reservation entity
            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(10,2)");
                entity.Property(e => e.SpecialRequests).HasMaxLength(1000);
                
                // Foreign key relationships
                entity.HasOne(e => e.Guest)
                    .WithMany(g => g.Reservations)
                    .HasForeignKey(e => e.GuestId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(e => e.Room)
                    .WithMany(r => r.Reservations)
                    .HasForeignKey(e => e.RoomId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
