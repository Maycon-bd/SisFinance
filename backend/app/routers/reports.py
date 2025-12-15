import io
import csv
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import Transaction, User

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/export/csv")
def export_csv(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=1970, le=2100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from sqlalchemy import extract

    txs = (
        db.query(Transaction)
        .filter(Transaction.user_id == user.id)
        .filter(extract('month', Transaction.date) == month)
        .filter(extract('year', Transaction.date) == year)
        .order_by(Transaction.date.asc())
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["date", "type", "amount", "category", "description"]) 
    for t in txs:
        writer.writerow([
            t.date.isoformat(),
            t.type,
            f"{float(t.amount):.2f}",
            t.category.name if t.category else "",
            t.description or "",
        ])
    output.seek(0)

    filename = f"sysfinance_{year}_{month:02d}.csv"
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


@router.get("/export/pdf")
def export_pdf(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=1970, le=2100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from sqlalchemy import extract
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas

    txs = (
        db.query(Transaction)
        .filter(Transaction.user_id == user.id)
        .filter(extract('month', Transaction.date) == month)
        .filter(extract('year', Transaction.date) == year)
        .order_by(Transaction.date.asc())
        .all()
    )

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 50, f"Relatório - {month:02d}/{year}")
    c.setFont("Helvetica", 10)

    y = height - 80
    total_income = 0.0
    total_expense = 0.0

    for t in txs:
        amount = float(t.amount)
        if t.type == "income":
            total_income += amount
        else:
            total_expense += amount
        line = f"{t.date.isoformat()} | {t.type:<7} | R$ {amount:>8.2f} | {(t.category.name if t.category else ''):<15} | {t.description or ''}"
        c.drawString(50, y, line[:95])
        y -= 15
        if y < 50:
            c.showPage()
            c.setFont("Helvetica", 10)
            y = height - 50

    net = total_income - total_expense

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y - 10, f"Receitas: R$ {total_income:.2f}")
    c.drawString(250, y - 10, f"Despesas: R$ {total_expense:.2f}")
    c.drawString(450, y - 10, f"Saldo: R$ {net:.2f}")

    c.showPage()
    c.save()
    buffer.seek(0)

    filename = f"sysfinance_{year}_{month:02d}.pdf"
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={filename}"})