
from datetime import datetime, date
from time import perf_counter
from dateutil.relativedelta import relativedelta


class APIFetchError(Exception):
    """Custom exception for API fetch errors."""

    pass


def time_delta_YMD(start_date, end_date=None):
    """Calculates the time difference between two dates in years, months, and days."""

    date_format = '%Y-%m-%dT%H:%M:%SZ'
    start_date = datetime.strptime(start_date, date_format)
    end_date = datetime.strptime(end_date, date_format) if end_date else datetime.now()

    time_delta = relativedelta(end_date, start_date)
    years, months, days = time_delta.years, time_delta.months, time_delta.days

    return f"{years} yrs, {months} mth , {days} dys"

def time_delta_DHM(start_date, end_date=None):
    """Calculates the time difference between two dates in days, hours, and minutes."""

    date_format = '%Y-%m-%dT%H:%M:%SZ'
    start_date = datetime.strptime(start_date, date_format)
    end_date = datetime.strptime(end_date, date_format) if end_date else datetime.now()

    time_delta = relativedelta(end_date, start_date)
    days, hours, minutes = time_delta.days, time_delta.hours, time_delta.minutes

    return f"{days} dys, {hours} hrs , {minutes} min"

def time_async_operation(func):
    """A decorator to measure the elapsed time for an asynchronous function."""
    
    async def wrapper(*args, **kwargs):
        start_time = perf_counter()
        result = await func(*args, **kwargs)
        end_time = perf_counter()
        elapsed_time = end_time - start_time
        print(f"{func.__name__} completed in {elapsed_time:.2f} seconds")
        return result
    return wrapper

