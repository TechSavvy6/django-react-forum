from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'size'

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'pages_count': self.page.paginator.num_pages,
            'results': data,
        })
    # ! items per page
    # ? /api/foo/?page=2&size=10
