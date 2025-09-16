# Hotel Management System - Guest Population Script
# This script helps you populate the database with sample guest data

param(
    [string]$BaseUrl = "http://localhost:5159",
    [string]$Action = "menu"
)

$apiUrl = "$BaseUrl/api/guests"

function Show-Menu {
    Write-Host "`n===== Hotel Management System - Guest Population =====" -ForegroundColor Cyan
    Write-Host "1. Add ALL sample guests (30 guests - Premium, Business, Leisure)" -ForegroundColor Yellow
    Write-Host "2. Add Premium guests only (10 VIP guests)" -ForegroundColor Yellow
    Write-Host "3. Add Business guests only (10 corporate guests)" -ForegroundColor Yellow
    Write-Host "4. Add Leisure guests only (10 vacation guests)" -ForegroundColor Yellow
    Write-Host "5. Add Random guests (specify count)" -ForegroundColor Yellow
    Write-Host "6. View current guests" -ForegroundColor Yellow
    Write-Host "7. Add custom guest manually" -ForegroundColor Yellow
    Write-Host "8. Exit" -ForegroundColor Yellow
    Write-Host "=======================================================" -ForegroundColor Cyan
    
    $choice = Read-Host "`nSelect an option (1-8)"
    
    switch ($choice) {
        "1" { Add-SampleGuests "all" }
        "2" { Add-SampleGuests "premium" }
        "3" { Add-SampleGuests "business" }
        "4" { Add-SampleGuests "leisure" }
        "5" { Add-RandomGuests }
        "6" { View-Guests }
        "7" { Add-CustomGuest }
        "8" { 
            Write-Host "`nExiting..." -ForegroundColor Green
            exit 
        }
        default { 
            Write-Host "`nInvalid option. Please try again." -ForegroundColor Red
            Show-Menu
        }
    }
}

function Add-SampleGuests {
    param([string]$Type)
    
    Write-Host "`nAdding $Type guests..." -ForegroundColor Green
    
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/populate-sample?type=$Type" -Method Post -ContentType "application/json"
        
        Write-Host "`n✅ Successfully added guests!" -ForegroundColor Green
        Write-Host "Total Requested: $($response.totalRequested)" -ForegroundColor Cyan
        Write-Host "Total Created: $($response.totalCreated)" -ForegroundColor Cyan
        
        if ($response.errors -and $response.errors.Count -gt 0) {
            Write-Host "`n⚠️ Some guests could not be added (may already exist):" -ForegroundColor Yellow
            foreach ($error in $response.errors) {
                Write-Host "  - $error" -ForegroundColor Yellow
            }
        }
        
        if ($response.createdGuests -and $response.createdGuests.Count -gt 0) {
            Write-Host "`nNewly created guests:" -ForegroundColor Green
            foreach ($guest in $response.createdGuests) {
                Write-Host "  ✓ $($guest.name) - $($guest.email)" -ForegroundColor White
            }
        }
    }
    catch {
        Write-Host "`n❌ Error adding guests: $_" -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

function Add-RandomGuests {
    $count = Read-Host "`nHow many random guests would you like to generate? (1-100)"
    
    if ($count -match '^\d+$' -and [int]$count -ge 1 -and [int]$count -le 100) {
        Write-Host "`nGenerating $count random guests..." -ForegroundColor Green
        
        try {
            $response = Invoke-RestMethod -Uri "$apiUrl/populate-random?count=$count" -Method Post -ContentType "application/json"
            
            Write-Host "`n✅ Successfully added guests!" -ForegroundColor Green
            Write-Host "Total Requested: $($response.totalRequested)" -ForegroundColor Cyan
            Write-Host "Total Created: $($response.totalCreated)" -ForegroundColor Cyan
            
            if ($response.errors -and $response.errors.Count -gt 0) {
                Write-Host "`n⚠️ Some guests could not be added:" -ForegroundColor Yellow
                foreach ($error in $response.errors) {
                    Write-Host "  - $error" -ForegroundColor Yellow
                }
            }
            
            if ($response.createdGuests -and $response.createdGuests.Count -gt 0) {
                Write-Host "`nNewly created guests:" -ForegroundColor Green
                foreach ($guest in $response.createdGuests) {
                    Write-Host "  ✓ $($guest.name) - $($guest.email)" -ForegroundColor White
                }
            }
        }
        catch {
            Write-Host "`n❌ Error adding guests: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "`nInvalid count. Please enter a number between 1 and 100." -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

function View-Guests {
    Write-Host "`nFetching current guests..." -ForegroundColor Green
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Get
        
        if ($response -and $response.Count -gt 0) {
            Write-Host "`n📋 Current Guests ($($response.Count) total):" -ForegroundColor Cyan
            Write-Host ("-" * 80) -ForegroundColor Gray
            
            foreach ($guest in $response) {
                Write-Host "ID: $($guest.id.ToString().PadRight(5)) | Name: $($guest.name.PadRight(25)) | Email: $($guest.email.PadRight(35)) | Phone: $($guest.phone)" -ForegroundColor White
            }
            Write-Host ("-" * 80) -ForegroundColor Gray
        }
        else {
            Write-Host "`nNo guests found in the database." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "`n❌ Error fetching guests: $_" -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

function Add-CustomGuest {
    Write-Host "`n=== Add Custom Guest ===" -ForegroundColor Cyan
    
    $name = Read-Host "Enter guest name"
    $email = Read-Host "Enter guest email"
    $phone = Read-Host "Enter guest phone"
    
    if ([string]::IsNullOrWhiteSpace($name) -or [string]::IsNullOrWhiteSpace($email) -or [string]::IsNullOrWhiteSpace($phone)) {
        Write-Host "`n❌ All fields are required!" -ForegroundColor Red
        Read-Host "`nPress Enter to continue"
        Show-Menu
        return
    }
    
    $guest = @{
        name = $name
        email = $email
        phone = $phone
    }
    
    $json = $guest | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $json -ContentType "application/json"
        
        Write-Host "`n✅ Guest added successfully!" -ForegroundColor Green
        Write-Host "ID: $($response.id)" -ForegroundColor Cyan
        Write-Host "Name: $($response.name)" -ForegroundColor Cyan
        Write-Host "Email: $($response.email)" -ForegroundColor Cyan
        Write-Host "Phone: $($response.phone)" -ForegroundColor Cyan
    }
    catch {
        Write-Host "`n❌ Error adding guest: $_" -ForegroundColor Red
    }
    
    Read-Host "`nPress Enter to continue"
    Show-Menu
}

# Quick action functions for direct command-line usage
function Quick-AddAll {
    Write-Host "Adding all sample guests..." -ForegroundColor Green
    Invoke-RestMethod -Uri "$apiUrl/populate-sample?type=all" -Method Post -ContentType "application/json" | Format-Table
}

function Quick-AddRandom {
    param([int]$Count = 10)
    Write-Host "Adding $Count random guests..." -ForegroundColor Green
    Invoke-RestMethod -Uri "$apiUrl/populate-random?count=$Count" -Method Post -ContentType "application/json" | Format-Table
}

# Main execution
if ($Action -eq "menu") {
    Show-Menu
}
elseif ($Action -eq "all") {
    Quick-AddAll
}
elseif ($Action -eq "random") {
    Quick-AddRandom
}
else {
    Write-Host "Usage examples:" -ForegroundColor Yellow
    Write-Host "  .\PopulateGuests.ps1                    # Interactive menu" -ForegroundColor White
    Write-Host "  .\PopulateGuests.ps1 -Action all        # Add all sample guests" -ForegroundColor White
    Write-Host "  .\PopulateGuests.ps1 -Action random     # Add 10 random guests" -ForegroundColor White
    Write-Host "  .\PopulateGuests.ps1 -BaseUrl http://localhost:7161  # Use HTTPS endpoint" -ForegroundColor White
}
