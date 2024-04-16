import csv
import random
import string

def generate_random_address():
    locations = ["Saigon Pavillon, 53 Bà Huyện Thanh Quan, Phường 6, Quận 3, Thành phố Hồ Chí Minh, Việt Nam"]
    locations.append("62G Đ. Võ Thị Sáu, Phường Tân Định, Quận 1, Thành phố Hồ Chí Minh 700000, Việt Nam")
    locations.append("3 Võ Văn Tần, Phường 6, Quận 3, Thành phố Hồ Chí Minh, Việt Nam")
    locations.append("46/11 Đ. Nguyễn Cửu Vân, Phường 17, Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam")
    locations.append("151 - 155 Đ. Bến Vân Đồn, Phường 6, Quận 4, Thành phố Hồ Chí Minh 754522, Việt Nam")
    locations.append("Him Lam Nam Sài Gòn, 6A Số 14, chung cư, Bình Chánh, Thành phố Hồ Chí Minh, Việt Nam")
    return random.choice(locations)

def generate_vietnamese_phone_number():
    # Common Vietnamese mobile prefixes
    prefixes = ["03", "05", "07", "08", "09"]

    # Choose a random prefix
    prefix = random.choice(prefixes)

    # Generate a 7-digit suffix
    suffix = "".join(str(random.randint(0, 9)) for _ in range(7))

    return prefix + suffix

def generate_random_name():
    # List of Vietnamese first names
    first_names = [
        "An", "Bao", "Chi", "Duc", "Giang", "Hai", "Khanh", "Lan", "Minh", "Nam",
        "Oanh", "Phong", "Quang", "Tuan", "Uyen", "Viet", "Xuan", "Yen"
    ]

    # List of Vietnamese last names
    last_names = [
        "Nguyen", "Tran", "Le", "Pham", "Hoang", "Huynh", "Phan", "Vu", "Vo", "Dang"
    ]
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    full_name = f"{last_name} {first_name}"
    return full_name

def generate_random_email(name):
    domains = ["example.com", "email.com", "gmail.com"]
    name_parts = name.lower().split()
    return name_parts[0] + "." + name_parts[1] + "@" + random.choice(domains)

# ... (similar functions for address and phone number)

with open('sample-data/customer_data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['customer_id', 'name', 'email', 'address', 'phone_number'])

    for i in range(1, 25):  # Generate 24 customers
        name = generate_random_name()
        email = generate_random_email(name)
        # ... generate address, phone number

        # Introduce some duplicates (adjust as needed)
        if i % 5 == 0:
            name += " " + "".join(random.choices(string.ascii_letters, k=2))  # Slightly modify name 

        address = generate_random_address()
        phone_number = generate_vietnamese_phone_number()

        # Write to CSV file
        writer.writerow([i, name, email, address, phone_number]) 
