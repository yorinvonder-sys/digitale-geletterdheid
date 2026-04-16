/**
 * riskRegisterService — Pure functies over AI_ACT_RISK_REGISTER (Art. 9).
 * Geen DB-calls, side-effect-vrij. Geschikt voor client en tests.
 */
import {
    AI_ACT_RISK_REGISTER,
    calculateScore,
    classifyScore,
    type AiActRisk,
    type RiskStatus,
    type ScoreClass,
} from '../config/aiActRiskRegister';

export function getAllRisks(): AiActRisk[] {
    return AI_ACT_RISK_REGISTER;
}

export function getRiskById(id: string): AiActRisk | undefined {
    return AI_ACT_RISK_REGISTER.find((r) => r.id === id);
}

export function getRisksByStatus(status: RiskStatus): AiActRisk[] {
    return AI_ACT_RISK_REGISTER.filter((r) => r.status === status);
}

export function getRisksByScoreClass(cls: ScoreClass): AiActRisk[] {
    return AI_ACT_RISK_REGISTER.filter((r) => classifyScore(calculateScore(r)) === cls);
}

export function getRisksDueForReview(withinDays: number): AiActRisk[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + withinDays);
    return AI_ACT_RISK_REGISTER.filter((r) => {
        const due = new Date(r.nextReviewDue);
        return due <= cutoff;
    });
}

export interface RiskPosture {
    total: number;
    open: number;
    nonCompliant: number;
    underControl: number;
    overdueReviews: number;
    criticalCount: number;
    highCount: number;
}

export function summariseRiskPosture(): RiskPosture {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let overdue = 0;
    let critical = 0;
    let high = 0;
    let nonCompliant = 0;
    let underControl = 0;
    let open = 0;
    for (const r of AI_ACT_RISK_REGISTER) {
        const score = calculateScore(r);
        const cls = classifyScore(score);
        if (cls === 'kritiek') critical += 1;
        if (cls === 'hoog') high += 1;
        if (r.status === 'non-compliant') nonCompliant += 1;
        if (r.status === 'beheerst') underControl += 1;
        if (r.status === 'actief' || r.status === 'onvoldoende-beheerst' || r.status === 'non-compliant') open += 1;
        if (new Date(r.nextReviewDue) < today) overdue += 1;
    }
    return {
        total: AI_ACT_RISK_REGISTER.length,
        open,
        nonCompliant,
        underControl,
        overdueReviews: overdue,
        criticalCount: critical,
        highCount: high,
    };
}
