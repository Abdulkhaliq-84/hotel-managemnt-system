# Hotel Management System - Room Population Script
# This script helps you populate the database with hotel room data

param(
    [string]$BaseUrl = "http://localhost:5159",
    [string]$Action = "menu"
)

$apiUrl = "$BaseUrl/api/rooms"

function Show-Menu {
    Write-Host "`n===== Hotel Management System - Room Population =====" -ForegroundColor Cyan
    Write-Host "1. Add Standard Hotel Rooms (50 rooms, floors 1-5)" -ForegroundColor Yellow
    Write-Host "2. Add Luxury Hotel Rooms (60 rooms, floors 1-10)" -ForegroundColor Yellow
    Write-Host "3. Add Boutique Hotel Rooms (15 unique themed rooms)" -ForegroundColor Yellow
    Write-Host "4. Add Economy Hotel Rooms (45 budget rooms)" -ForegroundColor Yellow
    Write-Host "5. Add Business Hotel Rooms (72 executive rooms)" -ForegroundColor Yellow
    Write-Host "6. Add Resort Rooms (20 vacation-style rooms)" -ForegroundColor Yellow
    Write-Host "7. Add Rooms for Specific Floor" -ForegroundColor Yellow
    Write-Host "8. Add Custom Random Rooms" -ForegroundColor Yellow
    Write-Host "9. View Current Rooms" -ForegroundColor Yellow
    Write-Host "10. View Room Statistics" -ForegroundColor Yellow
    Write-Host "11. Exit" -ForegroundColor Yellow
    Write-Host "======================================================" -ForegroundColor Cyan
    
    $choice = Read-Host "`nSelect an option (1-11)"
    
    switch ($choice) {
        "1" { Add-SampleRooms "standard" }
        "2" { Add-SampleRooms "luxury" }
        "3" { Add-SampleRooms "boutique" }
        "4" { Add-SampleRooms "economy" }
        "5" { Add-SampleRooms "business" }
        "6" { Add-SampleRooms "resort" }
        "7" { Add-FloorRooms }
        "8" { Add-CustomRooms }
        "9" { View-Rooms }
        "10" { View-RoomStats }
        "11" { 
            Write-Host "`nExiting..." -ForegroundColor Green
            exit 
        }
        default { 
            Write-Host "`nInvalid option. Please try again." -ForegroundColor Red
            Show-Menu
        }
    }
}

function Add-SampleRooms {
    param([string]$Type)
    
    Write-Host "`nAdding $Type hotel rooms..." -ForegroundColor Green
    
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/populate-sample?type=$Type" -Method Post -ContentType "application/json"
        
        Write-Host "`n✅ Successfully added rooms!" -ForegroundColor Green
        Write-Host "Total Requested: $($response.totalRequested)" -ForegroundColor Cyan
        Write-Host "Total Created: $($response.totalCreated)" -ForegroundColor Cyan
        
        if ($response.errors -and $response.errors.Count -gt 0) {
            Write-Host "`n⚠️ Some rooms could not be added (may already exist):" -ForegroundColor Yellow
            foreach ($error in $response.errors) {
                Write-Host "  - $error" -ForegroundColor Yellow
            }
        }
        
        if ($response.createdRooms -and $response.createdRooms.Count -gt 0) {
            Write-Host "`nSample of newly created rooms:" -ForegroundColor Green
            $response.createdRooms | Select-Object -First 5 | ForEach-Object {
                Write-Host "  ✓ Room $($_.roomNumber) - $($_.roomType) - `$$($_.pricePerNight)/night" -ForegroundColor White
            }
            if ($response.createdRooms.Count -gt 5) {
                Write-Host "  ... and $($response.createdRooms.Count - 5) more rooms" -ForegroundColor Gray
            }
        }
    }
    catch {
        Write-Host "`n❌ Error adding rooms: $_" -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

function Add-FloorRooms {
    $floor = Read-Host "`nEnter floor number (1-20)"
    $count = Read-Host "How many rooms on this floor? (1-50)"
    
    if ($floor -match '^\d+$' -and [int]$floor -ge 1 -and [int]$floor -le 20 -and
        $count -match '^\d+$' -and [int]$count -ge 1 -and [int]$count -le 50) {
        
        Write-Host "`nGenerating $count rooms for floor $floor..." -ForegroundColor Green
        
        try {
            $response = Invoke-RestMethod -Uri "$apiUrl/populate-floor?floorNumber=$floor&roomsPerFloor=$count" -Method Post -ContentType "application/json"
            
            Write-Host "`n✅ Successfully added rooms!" -ForegroundColor Green
            Write-Host "Total Requested: $($response.totalRequested)" -ForegroundColor Cyan
            Write-Host "Total Created: $($response.totalCreated)" -ForegroundColor Cyan
            
            if ($response.errors -and $response.errors.Count -gt 0) {
                Write-Host "`n⚠️ Some rooms could not be added:" -ForegroundColor Yellow
                foreach ($error in $response.errors) {
                    Write-Host "  - $error" -ForegroundColor Yellow
                }
            }
            
            if ($response.createdRooms -and $response.createdRooms.Count -gt 0) {
                Write-Host "`nCreated rooms:" -ForegroundColor Green
                foreach ($room in $response.createdRooms) {
                    Write-Host "  ✓ Room $($room.roomNumber) - $($room.roomType) - `$$($room.pricePerNight)/night" -ForegroundColor White
                }
            }
        }
        catch {
            Write-Host "`n❌ Error adding rooms: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "`nInvalid input. Floor must be 1-20 and room count must be 1-50." -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

function Add-CustomRooms {
    $count = Read-Host "`nHow many random rooms to generate? (1-100)"
    $roomType = Read-Host "Filter by room type (optional, press Enter for all types)"
    
    if ($count -match '^\d+$' -and [int]$count -ge 1 -and [int]$count -le 100) {
        Write-Host "`nGenerating $count custom rooms..." -ForegroundColor Green
        
        $uri = "$apiUrl/populate-custom?count=$count"
        if (![string]::IsNullOrWhiteSpace($roomType)) {
            $uri += "&roomType=$roomType"
        }
        
        try {
            $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json"
            
            Write-Host "`n✅ Successfully added rooms!" -ForegroundColor Green
            Write-Host "Total Requested: $($response.totalRequested)" -ForegroundColor Cyan
            Write-Host "Total Created: $($response.totalCreated)" -ForegroundColor Cyan
            
            if ($response.errors -and $response.errors.Count -gt 0) {
                Write-Host "`n⚠️ Some rooms could not be added:" -ForegroundColor Yellow
                foreach ($error in $response.errors) {
                    Write-Host "  - $error" -ForegroundColor Yellow
                }
            }
            
            if ($response.createdRooms -and $response.createdRooms.Count -gt 0) {
                Write-Host "`nSample of created rooms:" -ForegroundColor Green
                $response.createdRooms | Select-Object -First 10 | ForEach-Object {
                    Write-Host "  ✓ Room $($_.roomNumber) - $($_.roomType) - `$$($_.pricePerNight)/night" -ForegroundColor White
                }
                if ($response.createdRooms.Count -gt 10) {
                    Write-Host "  ... and $($response.createdRooms.Count - 10) more rooms" -ForegroundColor Gray
                }
            }
        }
        catch {
            Write-Host "`n❌ Error adding rooms: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "`nInvalid count. Please enter a number between 1 and 100." -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

function View-Rooms {
    Write-Host "`nFetching current rooms..." -ForegroundColor Green
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Get
        
        if ($response -and $response.Count -gt 0) {
            Write-Host "`n📋 Current Rooms ($($response.Count) total):" -ForegroundColor Cyan
            Write-Host ("-" * 100) -ForegroundColor Gray
            Write-Host "ID    | Room #      | Type                    | Price/Night | Available | Description (truncated)" -ForegroundColor White
            Write-Host ("-" * 100) -ForegroundColor Gray
            
            foreach ($room in $response | Sort-Object roomNumber) {
                $available = if ($room.isAvailable) { "Yes" } else { "No " }
                $desc = if ($room.description -and $room.description.Length -gt 30) { 
                    $room.description.Substring(0, 30) + "..." 
                } else { 
                    $room.description 
                }
                
                $availableColor = if ($room.isAvailable) { "Green" } else { "Red" }
                
                Write-Host "$($room.id.ToString().PadRight(5)) | " -NoNewline
                Write-Host "$($room.roomNumber.PadRight(11)) | " -NoNewline
                Write-Host "$($room.roomType.PadRight(23)) | " -NoNewline
                Write-Host "`$$($room.pricePerNight.ToString('F2').PadLeft(10)) | " -NoNewline
                Write-Host "$($available.PadRight(9)) " -ForegroundColor $availableColor -NoNewline
                Write-Host "| $desc" -ForegroundColor Gray
            }
            Write-Host ("-" * 100) -ForegroundColor Gray
        }
        else {
            Write-Host "`nNo rooms found in the database." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "`n❌ Error fetching rooms: $_" -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

function View-RoomStats {
    Write-Host "`nCalculating room statistics..." -ForegroundColor Green
    
    try {
        $rooms = Invoke-RestMethod -Uri $apiUrl -Method Get
        
        if ($rooms -and $rooms.Count -gt 0) {
            $totalRooms = $rooms.Count
            $availableRooms = ($rooms | Where-Object { $_.isAvailable }).Count
            $occupiedRooms = $totalRooms - $availableRooms
            
            # Group by room type
            $roomTypes = $rooms | Group-Object roomType | Sort-Object Count -Descending
            
            # Calculate price statistics
            $prices = $rooms | Select-Object -ExpandProperty pricePerNight
            $avgPrice = ($prices | Measure-Object -Average).Average
            $minPrice = ($prices | Measure-Object -Minimum).Minimum
            $maxPrice = ($prices | Measure-Object -Maximum).Maximum
            
            Write-Host "`n📊 ROOM STATISTICS" -ForegroundColor Cyan
            Write-Host "==================" -ForegroundColor Cyan
            
            Write-Host "`n📈 Overview:" -ForegroundColor Yellow
            Write-Host "  Total Rooms: $totalRooms" -ForegroundColor White
            Write-Host "  Available: $availableRooms ($([math]::Round($availableRooms/$totalRooms*100, 1))%)" -ForegroundColor Green
            Write-Host "  Occupied: $occupiedRooms ($([math]::Round($occupiedRooms/$totalRooms*100, 1))%)" -ForegroundColor Red
            
            Write-Host "`n💰 Pricing:" -ForegroundColor Yellow
            Write-Host "  Average Price: `$$([math]::Round($avgPrice, 2))/night" -ForegroundColor White
            Write-Host "  Lowest Price: `$$minPrice/night" -ForegroundColor Green
            Write-Host "  Highest Price: `$$maxPrice/night" -ForegroundColor Magenta
            
            Write-Host "`n🏨 Room Types Distribution:" -ForegroundColor Yellow
            foreach ($type in $roomTypes) {
                $percentage = [math]::Round($type.Count / $totalRooms * 100, 1)
                $bar = "*" * [math]::Min([math]::Round($percentage / 2), 50)
                Write-Host "  $($type.Name.PadRight(20)): $($type.Count.ToString().PadLeft(3)) rooms ($percentage%) $bar" -ForegroundColor White
            }
            
            # Group by floor (if room numbers are numeric)
            $floorsData = @{}
            foreach ($room in $rooms) {
                if ($room.roomNumber -match '^(\d+)') {
                    $floor = $matches[1]
                    if (-not $floorsData.ContainsKey($floor)) {
                        $floorsData[$floor] = @{ Total = 0; Available = 0 }
                    }
                    $floorsData[$floor].Total++
                    if ($room.isAvailable) {
                        $floorsData[$floor].Available++
                    }
                }
            }
            
            if ($floorsData.Count -gt 0) {
                Write-Host "`n🏢 Floor Distribution:" -ForegroundColor Yellow
                foreach ($floor in $floorsData.Keys | Sort-Object) {
                    $data = $floorsData[$floor]
                    $occupancy = [math]::Round((1 - $data.Available/$data.Total) * 100, 1)
                    Write-Host "  Floor $($floor.PadLeft(2)): $($data.Total.ToString().PadLeft(3)) rooms, $($occupancy)% occupancy" -ForegroundColor White
                }
            }
        }
        else {
            Write-Host "`nNo rooms found in the database." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "`n❌ Error calculating statistics: $_" -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

# Quick action functions
function Quick-AddStandard {
    Write-Host "Adding standard hotel rooms..." -ForegroundColor Green
    Invoke-RestMethod -Uri "$apiUrl/populate-sample?type=standard" -Method Post -ContentType "application/json" | Format-Table
}

function Quick-AddAll {
    Write-Host "Adding mixed room types..." -ForegroundColor Green
    Invoke-RestMethod -Uri "$apiUrl/populate-sample?type=all" -Method Post -ContentType "application/json" | Format-Table
}

# Main execution
if ($Action -eq "menu") {
    Show-Menu
}
elseif ($Action -eq "standard") {
    Quick-AddStandard
}
elseif ($Action -eq "all") {
    Quick-AddAll
}
else {
    Write-Host "Usage examples:" -ForegroundColor Yellow
    Write-Host "  .\PopulateRooms.ps1                    # Interactive menu" -ForegroundColor White
    Write-Host "  .\PopulateRooms.ps1 -Action standard   # Add standard hotel rooms" -ForegroundColor White
    Write-Host "  .\PopulateRooms.ps1 -Action all        # Add sample mixed rooms" -ForegroundColor White
    Write-Host "  .\PopulateRooms.ps1 -BaseUrl http://localhost:7161  # Use HTTPS endpoint" -ForegroundColor White
}
