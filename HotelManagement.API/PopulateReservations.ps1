# PopulateReservations.ps1
# PowerShell script for managing hotel reservations via API

$baseUrl = "http://localhost:5159/api"

function Show-Menu {
    Write-Host "`n========== RESERVATION MANAGEMENT ==========" -ForegroundColor Cyan
    Write-Host "1. View All Reservations" -ForegroundColor Yellow
    Write-Host "2. View Reservation Statistics" -ForegroundColor Yellow
    Write-Host "3. Add Random Reservations" -ForegroundColor Green
    Write-Host "4. Add Business Reservations" -ForegroundColor Green
    Write-Host "5. Add Vacation Reservations" -ForegroundColor Green
    Write-Host "6. Add Weekend Getaway Reservations" -ForegroundColor Green
    Write-Host "7. Add Group Reservations" -ForegroundColor Green
    Write-Host "8. Add Mixed Type Reservations (Bulk)" -ForegroundColor Green
    Write-Host "9. Check Room Availability" -ForegroundColor Magenta
    Write-Host "10. View Guest Reservation History" -ForegroundColor Magenta
    Write-Host "0. Exit" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Cyan
}

function Get-Reservations {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reservations" -Method Get
        
        if ($response.value -and $response.value.Count -gt 0) {
            Write-Host "`n=== CURRENT RESERVATIONS ===" -ForegroundColor Cyan
            $response.value | ForEach-Object {
                $statusColor = switch ($_.status) {
                    "Confirmed" { "Green" }
                    "Pending" { "Yellow" }
                    "CheckedIn" { "Cyan" }
                    "CheckedOut" { "Gray" }
                    "Cancelled" { "Red" }
                    default { "White" }
                }
                
                Write-Host "`nReservation #$($_.id):" -ForegroundColor White
                Write-Host "  Guest: $($_.guestName)" -ForegroundColor White
                Write-Host "  Room: $($_.roomNumber) - $($_.roomType)" -ForegroundColor White
                Write-Host "  Check-in: $($_.checkInDate.Substring(0,10))" -ForegroundColor White
                Write-Host "  Check-out: $($_.checkOutDate.Substring(0,10))" -ForegroundColor White
                Write-Host "  Guests: $($_.numberOfGuests)" -ForegroundColor White
                Write-Host "  Status: $($_.status)" -ForegroundColor $statusColor
                Write-Host "  Payment: $($_.paymentStatus)" -ForegroundColor White
                Write-Host "  Total: `$$($_.totalPrice)" -ForegroundColor Green
            }
            Write-Host "`nTotal Reservations: $($response.Count)" -ForegroundColor Cyan
        } else {
            Write-Host "`nNo reservations found." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error fetching reservations: $_" -ForegroundColor Red
    }
}

function Get-ReservationStats {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reservations" -Method Get
        
        if ($response.value -and $response.value.Count -gt 0) {
            $stats = @{
                Total = $response.Count
                ByStatus = $response.value | Group-Object -Property status
                ByPaymentStatus = $response.value | Group-Object -Property paymentStatus
                TotalRevenue = ($response.value | Measure-Object -Property totalPrice -Sum).Sum
                AveragePrice = ($response.value | Measure-Object -Property totalPrice -Average).Average
                UpcomingCheckIns = ($response.value | Where-Object { 
                    [DateTime]$_.checkInDate -gt (Get-Date) -and $_.status -eq "Pending" 
                }).Count
            }
            
            Write-Host "`n=== RESERVATION STATISTICS ===" -ForegroundColor Cyan
            Write-Host "Total Reservations: $($stats.Total)" -ForegroundColor White
            
            Write-Host "`nBy Status:" -ForegroundColor Yellow
            $stats.ByStatus | ForEach-Object {
                $color = switch ($_.Name) {
                    "Confirmed" { "Green" }
                    "Pending" { "Yellow" }
                    "CheckedIn" { "Cyan" }
                    "CheckedOut" { "Gray" }
                    "Cancelled" { "Red" }
                    default { "White" }
                }
                Write-Host "  $($_.Name): $($_.Count)" -ForegroundColor $color
            }
            
            Write-Host "`nBy Payment Status:" -ForegroundColor Yellow
            $stats.ByPaymentStatus | ForEach-Object {
                $color = switch ($_.Name) {
                    "Paid" { "Green" }
                    "Pending" { "Yellow" }
                    "PartiallyPaid" { "Cyan" }
                    "Refunded" { "Red" }
                    default { "White" }
                }
                Write-Host "  $($_.Name): $($_.Count)" -ForegroundColor $color
            }
            
            Write-Host "`nFinancial Summary:" -ForegroundColor Yellow
            Write-Host "  Total Revenue: `$$($stats.TotalRevenue)" -ForegroundColor Green
            Write-Host "  Average Booking: `$$([math]::Round($stats.AveragePrice, 2))" -ForegroundColor Green
            Write-Host "  Upcoming Check-ins: $($stats.UpcomingCheckIns)" -ForegroundColor Cyan
        } else {
            Write-Host "`nNo reservation data available." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error calculating statistics: $_" -ForegroundColor Red
    }
}

function Add-RandomReservations {
    param([int]$Count = 5)
    
    Write-Host "`nAdding $Count random reservations..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reservations/populate-custom?count=$Count" -Method Post -ContentType "application/json"
        
        if ($response.totalCreated -gt 0) {
            Write-Host "Success: Created $($response.totalCreated) reservations" -ForegroundColor Green
            
            if ($response.createdReservations) {
                Write-Host "`nCreated Reservations:" -ForegroundColor Cyan
                $response.createdReservations | ForEach-Object {
                Write-Host "  - $($_.guestName) in Room $($_.roomNumber) ($([string]$_.checkInDate.Substring(0,10)) to $([string]$_.checkOutDate.Substring(0,10)))" -ForegroundColor White
                }
            }
        }
        
        if ($response.totalSkipped -gt 0) {
            Write-Host "Warning: Skipped $($response.totalSkipped) reservations (conflicts or no availability)" -ForegroundColor Yellow
        }
        
        if ($response.errors -and $response.errors.Count -gt 0) {
            Write-Host "Errors encountered:" -ForegroundColor Red
            $response.errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        }
    } catch {
        Write-Host "Error adding random reservations: $_" -ForegroundColor Red
    }
}

function Add-TypedReservations {
    param(
        [string]$Type,
        [int]$Count = 5
    )
    
    $typeDisplay = switch ($Type) {
        "business" { "Business" }
        "vacation" { "Vacation" }
        "weekend" { "Weekend Getaway" }
        "group" { "Group" }
        default { $Type }
    }
    
    Write-Host "`nAdding $Count $typeDisplay reservations..." -ForegroundColor Yellow
    
    try {
        $uri = "$baseUrl/reservations/populate?type=$Type" + "&count=$Count"
        $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json"
        
        if ($response.totalCreated -gt 0) {
            Write-Host "Success: Created $($response.totalCreated) $typeDisplay reservations" -ForegroundColor Green
            
            if ($response.createdReservations) {
                Write-Host "`nCreated Reservations:" -ForegroundColor Cyan
                $response.createdReservations | ForEach-Object {
                Write-Host "  - $($_.guestName) in Room $($_.roomNumber) ($([string]$_.checkInDate.Substring(0,10)) to $([string]$_.checkOutDate.Substring(0,10)))" -ForegroundColor White
                }
            }
        }
        
        if ($response.totalSkipped -gt 0) {
            Write-Host "Warning: Skipped $($response.totalSkipped) reservations (conflicts or no availability)" -ForegroundColor Yellow
        }
        
        if ($response.errors -and $response.errors.Count -gt 0) {
            Write-Host "Errors encountered:" -ForegroundColor Red
            $response.errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        }
    } catch {
        Write-Host "Error adding $typeDisplay reservations: $_" -ForegroundColor Red
    }
}

function Add-BulkMixedReservations {
    param([int]$Count = 20)
    
    Write-Host "`nAdding $Count mixed-type reservations..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reservations/bulk" -Method Post -ContentType "application/json" -Body ($Count | ConvertTo-Json)
        
        if ($response.totalCreated -gt 0) {
            Write-Host "Success: Created $($response.totalCreated) mixed reservations" -ForegroundColor Green
            
            if ($response.createdReservations) {
                # Group by type for summary
                $byType = $response.createdReservations | Group-Object -Property { 
                    if ($_.specialRequests -match "conference|presentation|printer") { "Business" }
                    elseif ($_.specialRequests -match "romantic|champagne|spa") { "Weekend" }
                    elseif ($_.specialRequests -match "tour|beach|mountain") { "Vacation" }
                    elseif ($_.numberOfGuests -ge 3) { "Group" }
                    else { "Standard" }
                }
                
                Write-Host "`nReservations by Type:" -ForegroundColor Cyan
                $byType | ForEach-Object {
                    Write-Host "  $($_.Name): $($_.Count)" -ForegroundColor White
                }
                
                Write-Host "`nSample Reservations:" -ForegroundColor Cyan
                $response.createdReservations | Select-Object -First 5 | ForEach-Object {
                Write-Host "  - $($_.guestName) in Room $($_.roomNumber) ($([string]$_.checkInDate.Substring(0,10)) to $([string]$_.checkOutDate.Substring(0,10)))" -ForegroundColor White
                }
                if ($response.createdReservations.Count -gt 5) {
                    Write-Host "  ... and $($response.createdReservations.Count - 5) more" -ForegroundColor Gray
                }
            }
        }
        
        if ($response.totalSkipped -gt 0) {
            Write-Host "Warning: Skipped $($response.totalSkipped) reservations (conflicts or no availability)" -ForegroundColor Yellow
        }
        
        if ($response.errors -and $response.errors.Count -gt 0) {
            Write-Host "Errors encountered:" -ForegroundColor Red
            $response.errors | Select-Object -First 3 | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
            if ($response.errors.Count -gt 3) {
                Write-Host "  ... and $($response.errors.Count - 3) more errors" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "Error adding bulk reservations: $_" -ForegroundColor Red
    }
}

function Check-RoomAvailability {
    Write-Host "`nChecking room availability..." -ForegroundColor Yellow
    
    try {
        # Get all rooms
        $rooms = Invoke-RestMethod -Uri "$baseUrl/rooms" -Method Get
        
        # Get all reservations
        $reservations = Invoke-RestMethod -Uri "$baseUrl/reservations" -Method Get
        
        if ($rooms -and $rooms.Count -gt 0) {
            $today = Get-Date
            $availableCount = 0
            $occupiedCount = 0
            
            Write-Host "`n=== ROOM AVAILABILITY ===" -ForegroundColor Cyan
            
            $rooms | ForEach-Object {
                $room = $_
                # Check if room has active reservation for today
                $activeReservation = $reservations.value | Where-Object {
                    $_.roomNumber -eq $room.roomNumber -and
                    $_.status -in @("CheckedIn", "Confirmed", "Pending") -and
                    [DateTime]$_.checkInDate -le $today -and
                    [DateTime]$_.checkOutDate -gt $today
                } | Select-Object -First 1
                
                if ($activeReservation) {
                    $occupiedCount++
                    Write-Host "  Room $($room.roomNumber) ($($room.roomType)): OCCUPIED - Guest: $($activeReservation.guestName)" -ForegroundColor Red
                } elseif ($room.isAvailable) {
                    $availableCount++
                    Write-Host "  Room $($room.roomNumber) ($($room.roomType)): AVAILABLE - `$$($room.pricePerNight)/night" -ForegroundColor Green
                } else {
                    Write-Host "  Room $($room.roomNumber) ($($room.roomType)): MAINTENANCE" -ForegroundColor Yellow
                }
            }
            
            Write-Host "`nSummary:" -ForegroundColor Cyan
            Write-Host "  Available: $availableCount rooms" -ForegroundColor Green
            Write-Host "  Occupied: $occupiedCount rooms" -ForegroundColor Red
            Write-Host "  Total: $($rooms.Count) rooms" -ForegroundColor White
            $occupancyRate = if ($rooms.Count -gt 0) { [math]::Round(($occupiedCount / $rooms.Count) * 100, 1) } else { 0 }
            Write-Host "  Occupancy Rate: $occupancyRate%" -ForegroundColor Cyan
        } else {
            Write-Host "No rooms found in the system." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error checking availability: $_" -ForegroundColor Red
    }
}

function Get-GuestReservationHistory {
    $guestName = Read-Host "Enter guest name (partial match supported)"
    
    try {
        $reservations = Invoke-RestMethod -Uri "$baseUrl/reservations" -Method Get
        
        $guestReservations = $reservations.value | Where-Object { 
            $_.guestName -like "*$guestName*" 
        }
        
        if ($guestReservations -and $guestReservations.Count -gt 0) {
            $uniqueGuests = $guestReservations | Select-Object -Property guestName -Unique
            
            foreach ($guest in $uniqueGuests) {
                $guestBookings = $guestReservations | Where-Object { $_.guestName -eq $guest.guestName }
                
                Write-Host "`n=== Reservation History: $($guest.guestName) ===" -ForegroundColor Cyan
                Write-Host "Total Bookings: $($guestBookings.Count)" -ForegroundColor White
                
                $guestBookings | Sort-Object checkInDate | ForEach-Object {
                    $statusColor = switch ($_.status) {
                        "Confirmed" { "Green" }
                        "Pending" { "Yellow" }
                        "CheckedIn" { "Cyan" }
                        "CheckedOut" { "Gray" }
                        "Cancelled" { "Red" }
                        default { "White" }
                    }
                    
                    Write-Host "`n  Reservation #$($_.id):" -ForegroundColor White
                    Write-Host "    Room: $($_.roomNumber) - $($_.roomType)" -ForegroundColor White
                    Write-Host "    Dates: $($_.checkInDate.Substring(0,10)) to $($_.checkOutDate.Substring(0,10))" -ForegroundColor White
                    Write-Host "    Status: $($_.status)" -ForegroundColor $statusColor
                    Write-Host "    Total: `$$($_.totalPrice)" -ForegroundColor Green
                }
                
                $totalSpent = ($guestBookings | Where-Object { $_.paymentStatus -eq "Paid" } | Measure-Object -Property totalPrice -Sum).Sum
                Write-Host "`n  Total Spent: `$$totalSpent" -ForegroundColor Green
            }
        } else {
            Write-Host "`nNo reservations found for guest matching '$guestName'" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error fetching guest history: $_" -ForegroundColor Red
    }
}

# Main Program Loop
Clear-Host
Write-Host "=== Hotel Reservation Management System ===" -ForegroundColor Cyan
Write-Host "Connected to: $baseUrl" -ForegroundColor Gray

do {
    Show-Menu
    $choice = Read-Host "`nSelect an option"
    
    switch ($choice) {
        '1' { Get-Reservations }
        '2' { Get-ReservationStats }
        '3' { 
            $count = Read-Host "How many random reservations to add? (default: 5)"
            if ([string]::IsNullOrWhiteSpace($count)) { $count = 5 }
            Add-RandomReservations -Count ([int]$count)
        }
        '4' { 
            $count = Read-Host "How many business reservations to add? (default: 5)"
            if ([string]::IsNullOrWhiteSpace($count)) { $count = 5 }
            Add-TypedReservations -Type "business" -Count ([int]$count)
        }
        '5' { 
            $count = Read-Host "How many vacation reservations to add? (default: 5)"
            if ([string]::IsNullOrWhiteSpace($count)) { $count = 5 }
            Add-TypedReservations -Type "vacation" -Count ([int]$count)
        }
        '6' { 
            $count = Read-Host "How many weekend getaway reservations to add? (default: 5)"
            if ([string]::IsNullOrWhiteSpace($count)) { $count = 5 }
            Add-TypedReservations -Type "weekend" -Count ([int]$count)
        }
        '7' { 
            $count = Read-Host "How many group reservations to add? (default: 3)"
            if ([string]::IsNullOrWhiteSpace($count)) { $count = 3 }
            Add-TypedReservations -Type "group" -Count ([int]$count)
        }
        '8' { 
            $count = Read-Host "How many mixed reservations to add? (default: 20)"
            if ([string]::IsNullOrWhiteSpace($count)) { $count = 20 }
            Add-BulkMixedReservations -Count ([int]$count)
        }
        '9' { Check-RoomAvailability }
        '10' { Get-GuestReservationHistory }
        '0' { 
            Write-Host "`nExiting Reservation Management System..." -ForegroundColor Yellow
            break 
        }
        default { 
            Write-Host "`nInvalid option. Please try again." -ForegroundColor Red 
        }
    }
    
    if ($choice -ne '0') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
} while ($choice -ne '0')

Write-Host "Goodbye!" -ForegroundColor Green
