from locust import HttpUser, TaskSet, task, between
import random
import string
from dotenv import load_dotenv
import os
load_dotenv()

from locust import HttpUser, TaskSet, task, between
import random
import string

from locust import HttpUser, TaskSet, task, between
import random
import string
import os

from locust import HttpUser, TaskSet, task, between, constant
import random
import string
import os
import time

class UserBehavior(TaskSet):
    def on_start(self):
        """ Called when a Locust user starts running """
        self.headers = {
            'Content-Type': 'application/json',
            'x-custom-header': os.getenv('CUSTOM_HEADER')  # Read header value from environment variable
        }
        self.employee_ids = []

    @task(1)
    def create_employee(self):
        email = self.generate_unique_email()
        body = {
            'name': self.generate_random_string(5),
            'lastName': self.generate_random_string(7),
            'email': email,
            'password': '11111111',
            'position': self.generate_random_string(10)
        }
        response = self.client.post('/employee', json=body, headers=self.headers)
        if response.status_code == 201:
            employee_id = response.json().get('employeeId')
            if employee_id:
                self.employee_ids.append(employee_id)

    @task(2)
    def create_employee_relations(self):
        if len(self.employee_ids) < 2:
            return

        manager_id = random.choice(self.employee_ids)
        # Ensure we don't select a manager for themselves or form a cycle
        eligible_employees = [e_id for e_id in self.employee_ids if e_id != manager_id]
        if len(eligible_employees) < 20:
            return

        employee_ids = random.sample(eligible_employees, 10)
        body = {
            'managerId': manager_id,
            'employeeIds': employee_ids
        }
        self.client.post('/employees-relations', json=body, headers=self.headers)

    def generate_unique_email(self):
        """ Generate a unique email address """
        return f"{self.generate_random_string(8)}@example.com"

    def generate_random_string(self, length):
        """ Generate a random string of fixed length """
        letters = string.ascii_lowercase
        return ''.join(random.choice(letters) for _ in range(length))

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(0.1, 1)  # Adjust based on how fast you want the requests to be sent

    # def on_start(self):
    #     """ Called when a Locust user starts running """
    #     time.sleep(10)  # Wait for 1 minute before starting the relation creation


if __name__ == "__main__":
    import os
    os.system("locust -f main.py")
