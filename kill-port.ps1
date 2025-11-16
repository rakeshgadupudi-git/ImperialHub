# PowerShell script to kill process on port 5000
$port = 5000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($processes) {
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        Write-Host "Killing process $pid on port $port"
        Stop-Process -Id $pid -Force
    }
    Write-Host "Port $port is now free!"
} else {
    Write-Host "No process found on port $port"
}

