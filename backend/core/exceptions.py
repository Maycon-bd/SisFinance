"""Exceções personalizadas da aplicação."""

from fastapi import HTTPException, status


class SisFinanceException(Exception):
    """Exceção base do SisFinance."""
    pass


class DatabaseException(SisFinanceException):
    """Exceção relacionada ao banco de dados."""
    pass


class ValidationException(SisFinanceException):
    """Exceção de validação de dados."""
    pass


class AuthenticationException(SisFinanceException):
    """Exceção de autenticação."""
    pass


class AuthorizationException(SisFinanceException):
    """Exceção de autorização."""
    pass


# Exceções HTTP específicas
class CategoriaNotFound(HTTPException):
    """Categoria não encontrada."""
    def __init__(self, categoria_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoria com ID {categoria_id} não encontrada"
        )


class TransacaoNotFound(HTTPException):
    """Transação não encontrada."""
    def __init__(self, transacao_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transação com ID {transacao_id} não encontrada"
        )


class SaldoInsuficiente(HTTPException):
    """Saldo insuficiente para a operação."""
    def __init__(self, saldo_atual: float, valor_solicitado: float):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Saldo insuficiente. Saldo atual: R$ {saldo_atual:.2f}, Valor solicitado: R$ {valor_solicitado:.2f}"
        )