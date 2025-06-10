from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
	page_size = 10  # valor padrão
	page_size_query_param = 'size'
	max_page_size = 100

	def get_paginated_response(self, data):
		return Response({
			'total': self.page.paginator.count,
			'page': self.page.number,
			'size': self.get_page_size(self.request),
			'results': data
		})