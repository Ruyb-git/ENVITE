from django.contrib import admin

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User
from .forms import UserAdminCreationForm, UserAdminForm

from django.contrib.auth.models import Group, Permission


class UserAdmin(BaseUserAdmin):

    add_form = UserAdminCreationForm
    add_fieldsets = (
        (None, {
            'fields': ('name','username', 'email', 'password1', 'password2')
        }),
    )
    form = UserAdminForm
    fieldsets = (
        (None, {
            'fields': ('email', 'username')
        }),
        ('Informações básicas', {
            'fields': ('name', 'last_login')
        }),

        (
            'Permissões', {
                'fields': (
                    'is_active', 'is_staff', 'is_superuser', 'groups',
                    'user_permissions'
                )
            }
        ),
         ('Informações de perfil', {
            'fields': ('bio', 'avatar')
        }),
    )
    list_display = ['name','username', 'email', 'is_active', 'is_staff', 'date_joined','bio', 'avatar']


admin.site.register(User, UserAdmin)
