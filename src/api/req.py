import requests

# URL для отримання значення лічильника
counter_url = "http://127.0.0.1:5173/counter/6218523838"  # Припустимо, що user_id = 1

# Виконуємо запит GET для отримання поточного значення лічильника для користувача з user_id = 1
response = requests.get(counter_url)
print(response.json())