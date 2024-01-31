from django import template

register = template.Library()

@register.filter
def integer(value):
    try:
        result = int(value) 
    except (ValueError, TypeError):
        # Handle the case where value or arg is not a valid number
        result = 0  # You can choose a default value or handle it differently
    return result