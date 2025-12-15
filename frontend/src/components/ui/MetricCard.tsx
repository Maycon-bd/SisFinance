import type { ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   METRIC CARD - Material Design 3
   KPI card with icon, label, and value
═══════════════════════════════════════════════════════════════════════════ */

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    accent?: 'green' | 'red' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon,
    accent = 'neutral'
}) => {
    const getIconContainerClass = () => {
        switch (accent) {
            case 'green':
                return 'm3-kpi-card__icon-container--success';
            case 'red':
                return 'm3-kpi-card__icon-container--error';
            default:
                return 'm3-kpi-card__icon-container--primary';
        }
    };

    const getValueClass = () => {
        switch (accent) {
            case 'green':
                return 'm3-kpi-card__value--success';
            case 'red':
                return 'm3-kpi-card__value--error';
            default:
                return '';
        }
    };

    return (
        <div className="m3-card m3-kpi-card">
            {icon && (
                <div className={`m3-kpi-card__icon-container ${getIconContainerClass()}`}>
                    <span className="m3-kpi-card__icon">{icon}</span>
                </div>
            )}
            <span className="m3-kpi-card__label">{title}</span>
            <div className={`m3-kpi-card__value ${getValueClass()}`}>
                {value}
            </div>
        </div>
    );
};
