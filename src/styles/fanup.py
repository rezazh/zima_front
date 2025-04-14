from abc import ABC, abstractmethod

class Shape(ABC):  # کلاس پایه انتزاعی
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass
    
    def description(self):
        return "This is a geometric shape"

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

# ایجاد نمونه از کلاس انتزاعی (خطا می‌دهد)
try:
    shape = Shape()  # TypeError: Can't instantiate abstract class
except TypeError as e:
    print(f"Error: {e}")

# ایجاد نمونه از کلاس‌های فرزند (مشکلی ندارد)
rectangle = Rectangle(5, 4)
circle = Circle(3)

print(f"Rectangle area: {rectangle.area()}")  # 20
print(f"Rectangle perimeter: {rectangle.perimeter()}")  # 18
print(f"Rectangle description: {rectangle.description()}")  # This is a geometric shape

print(f"Circle area: {circle.area()}")  # ~28.27
print(f"Circle perimeter: {circle.perimeter()}")  # ~18.85