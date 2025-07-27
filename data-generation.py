import json
import random
from datetime import datetime, timedelta

def generate_machine_data():
    """Generate machine monitoring data for one week"""
    
    # Configuration
    STATUSES = ["Idle", "In Operation", "Warning", "Error"]
    INTERVAL_SECONDS = 10
    WEEK_DURATION = 7 * 24 * 60 * 60  # 7 days in seconds
    
    # Working hours (8 AM to 6 PM, Monday to Friday)
    WORK_START_HOUR = 8
    WORK_END_HOUR = 18
    
    # Status duration ranges (in seconds)
    ERROR_MIN_DURATION = 5 * 60      # 5 minutes
    ERROR_MAX_DURATION = 4 * 60 * 60 # 4 hours
    OPERATION_MAX_DURATION = 8 * 60 * 60  # 8 hours
    WARNING_MIN_DURATION = 30 * 60   # 30 minutes
    WARNING_MAX_DURATION = 2 * 60 * 60  # 2 hours
    
    # Start time (Monday at midnight)
    start_time = datetime(2025, 7, 21, 0, 0, 0)  # Monday
    current_time = start_time
    end_time = start_time + timedelta(seconds=WEEK_DURATION)
    
    data_points = []
    
    # Track current status and when it should change
    current_status = "Idle"
    status_end_time = current_time
    
    while current_time < end_time:
        # Check if we need to change status
        if current_time >= status_end_time:
            # Determine new status based on time of day and day of week
            is_weekday = current_time.weekday() < 5  # Monday = 0, Sunday = 6
            is_work_hours = WORK_START_HOUR <= current_time.hour < WORK_END_HOUR
            
            if is_weekday and is_work_hours:
                # During work hours, machine can be in any state
                # Higher probability for In Operation, some chance of Warning/Error
                status_weights = [10, 70, 15, 5]  # Idle, Operation, Warning, Error
            else:
                # Outside work hours, mostly Idle with occasional maintenance/errors
                status_weights = [85, 5, 7, 3]  # Idle, Operation, Warning, Error
            
            # Choose new status based on weights
            current_status = random.choices(STATUSES, weights=status_weights)[0]
            
            # Determine how long this status should last
            if current_status == "Error":
                duration = random.randint(ERROR_MIN_DURATION, ERROR_MAX_DURATION)
            elif current_status == "In Operation":
                duration = random.randint(30 * 60, OPERATION_MAX_DURATION)  # 30 min to 8 hours
            elif current_status == "Warning":
                duration = random.randint(WARNING_MIN_DURATION, WARNING_MAX_DURATION)
            else:  # Idle
                if is_weekday and is_work_hours:
                    duration = random.randint(5 * 60, 30 * 60)  # 5-30 minutes during work
                else:
                    duration = random.randint(60 * 60, 8 * 60 * 60)  # 1-8 hours outside work
            
            status_end_time = current_time + timedelta(seconds=duration)
        
        # Generate error code if status is Error
        error_code = 0
        if current_status == "Error":
            error_code = random.randint(1, 6)
        
        # Create data point
        data_point = {
            "timestamp": current_time.isoformat(),
            "status": current_status,
            "statusIndex": STATUSES.index(current_status),
            "errorCode": error_code
        }
        
        data_points.append(data_point)
        
        # Move to next interval
        current_time += timedelta(seconds=INTERVAL_SECONDS)
    
    return {
        "metadata": {
            "generatedAt": datetime.now().isoformat(),
            "startTime": start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "intervalSeconds": INTERVAL_SECONDS,
            "totalDataPoints": len(data_points),
            "statusDefinitions": {i: status for i, status in enumerate(STATUSES)},
            "errorCodes": {
                0: "No Error",
                1: "Temperature High",
                2: "Pressure Low",
                3: "Motor Fault",
                4: "Sensor Malfunction",
                5: "Communication Error",
                6: "Safety Interlock"
            }
        },
        "data": data_points
    }

def main():
    """Generate and save machine monitoring data"""
    print("Generating machine monitoring data for one week...")
    
    # Generate data
    machine_data = generate_machine_data()
    
    # Save to JSON file
    filename = "machine_monitoring_data.json"
    with open(filename, 'w') as f:
        json.dump(machine_data, f, indent=2)
    
    print(f"Data generated successfully!")
    print(f"File saved as: {filename}")
    print(f"Total data points: {machine_data['metadata']['totalDataPoints']}")
    print(f"Time range: {machine_data['metadata']['startTime']} to {machine_data['metadata']['endTime']}")
    
    # Display some statistics
    statuses = [point['status'] for point in machine_data['data']]
    status_counts = {status: statuses.count(status) for status in ["Idle", "In Operation", "Warning", "Error"]}
    
    print("\nStatus distribution:")
    for status, count in status_counts.items():
        percentage = (count / len(statuses)) * 100
        print(f"  {status}: {count} points ({percentage:.1f}%)")
    
    # Error code statistics
    errorCodes = [point['errorCode'] for point in machine_data['data'] if point['errorCode'] > 0]
    if errorCodes:
        print(f"\nError occurrences: {len(errorCodes)} total")
        for code in range(1, 7):
            count = errorCodes.count(code)
            if count > 0:
                errorName = machine_data['metadata']['errorCodes'][code]
                print(f"  Error {code} ({errorName}): {count} times")

if __name__ == "__main__":
    main()