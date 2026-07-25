"""Canonical domain models and controlled classifications."""

from __future__ import annotations

from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, model_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class ResourceType(StrEnum):
    FREE_PUBLIC_RESOURCE = "free_public_resource"
    FREE_BUSINESS_RESOURCE = "free_business_resource"
    PUBLIC_DATASET = "public_dataset"
    FUNDING_OPPORTUNITY = "funding_opportunity"
    TECHNICAL_ASSISTANCE_PROGRAM = "technical_assistance_program"
    TRAINING_PROGRAM = "training_program"
    MENTORSHIP_PROGRAM = "mentorship_program"
    BUSINESS_SERVICE = "business_service"
    COMMERCIAL_TOOL = "commercial_tool"
    ANALYTICS_TOOL = "analytics_tool"
    COMMERCIAL_FREEMIUM_TOOL = "commercial_freemium_tool"
    GOVERNMENT_PROGRAM = "government_program"
    NONPROFIT_PROGRAM = "nonprofit_program"
    UNIVERSITY_PROGRAM = "university_program"
    ACCELERATOR_OR_INCUBATOR = "accelerator_or_incubator"
    PROCUREMENT_OPPORTUNITY = "procurement_opportunity"
    FACILITY_OR_EQUIPMENT_RESOURCE = "facility_or_equipment_resource"
    LEGAL_OR_REGULATORY_RESOURCE = "legal_or_regulatory_resource"
    RESEARCH_OR_MARKET_INTELLIGENCE = "research_or_market_intelligence"
    COMMUNITY_SUPPORT_RESOURCE = "community_support_resource"


class InclusionBasis(StrEnum):
    DIRECT_ASSISTANCE = "direct_assistance"
    FUNDING_OR_FINANCIAL_ACCESS = "funding_or_financial_access"
    USEFUL_PUBLIC_INFORMATION = "useful_public_information"
    BUSINESS_ENABLING_INFRASTRUCTURE = "business_enabling_infrastructure"
    OPPORTUNITY_ACCESS = "opportunity_access"


class CostModel(StrEnum):
    FREE = "free"
    FREE_BASIC_TIER = "free_basic_tier"
    FREE_WITH_ELIGIBILITY = "free_with_eligibility"
    SUBSIDIZED = "subsidized"
    FREEMIUM = "freemium"
    PAID = "paid"
    SUCCESS_FEE = "success_fee"
    UNKNOWN = "unknown"


class BusinessStage(StrEnum):
    EXPLORING = "exploring"
    STARTUP = "startup"
    PRE_REVENUE = "pre_revenue"
    EARLY_REVENUE = "early_revenue"
    ESTABLISHED = "established"
    GROWTH = "growth"
    ACQUISITION = "acquisition"
    SUCCESSION = "succession"
    EXIT = "exit"


class UserType(StrEnum):
    ASPIRING_ENTREPRENEUR = "aspiring_entrepreneur"
    BUSINESS_OWNER = "business_owner"
    NONPROFIT = "nonprofit"
    FREELANCER = "freelancer"
    WORKER = "worker"
    STUDENT = "student"
    RESEARCHER = "researcher"
    INVESTOR = "investor"
    COMMUNITY_ORGANIZATION = "community_organization"
    GROWER = "grower"
    FOOD_BUSINESS = "food_business"
    EMPLOYER = "employer"
    SMALL_BUSINESS = "small_business"
    INDEPENDENT_OPERATOR = "independent_operator"


class GoalType(StrEnum):
    CLARIFY_DIRECTION = "clarify_direction"
    START_A_BUSINESS = "start_a_business"
    FIND_FUNDING = "find_funding"
    VALIDATE_AN_IDEA = "validate_an_idea"
    ACCESS_DATA = "access_data"
    IMPROVE_OPERATIONS = "improve_operations"
    FIND_CUSTOMERS = "find_customers"
    HIRE_WORKERS = "hire_workers"
    OBTAIN_CERTIFICATION = "obtain_certification"
    BUY_A_BUSINESS = "buy_a_business"
    SELL_A_BUSINESS = "sell_a_business"
    ACQUIRE_PROPERTY = "acquire_property"
    PURCHASE_EQUIPMENT = "purchase_equipment"
    ENTER_GOVERNMENT_CONTRACTING = "enter_government_contracting"
    EXPAND_INTO_NEW_MARKETS = "expand_into_new_markets"
    MEASURE_ONLINE_VISIBILITY = "measure_online_visibility"
    MONITOR_MARKETING_ACTIVITY = "monitor_marketing_activity"
    TRACK_WEBSITE_TRAFFIC = "track_website_traffic"
    TRACK_SOCIAL_IMPRESSIONS = "track_social_impressions"
    ESTABLISH_BASELINE_METRICS = "establish_baseline_metrics"


class SourceStatus(StrEnum):
    ACTIVE = "active"
    CLOSED = "closed"
    ARCHIVED = "archived"
    QUARANTINED = "quarantined"
    UNVERIFIED = "unverified"
    VERIFICATION_REQUIRED = "verification_required"


class VerificationState(StrEnum):
    VERIFIED = "verified"
    PARTIALLY_VERIFIED = "partially_verified"
    NOT_VERIFIED = "not_verified"
    FAILED = "failed"


class ProgressState(StrEnum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    COMPLETED = "completed"


class CostClassification(StrictModel):
    model: CostModel
    verification_required: bool = True
    paid_upgrade_available: bool = False
    details: str | None = None
    checked_at: datetime | None = None


class AudienceClassification(StrictModel):
    business_stages: list[BusinessStage] = Field(default_factory=list)
    user_types: list[UserType] = Field(default_factory=list)
    goals: list[GoalType] = Field(default_factory=list)


class MetricBoundaries(StrictModel):
    visibility: list[str] = Field(default_factory=list)
    engagement: list[str] = Field(default_factory=list)
    conversion: list[str] = Field(default_factory=list)


class Citation(StrictModel):
    source_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    url: HttpUrl
    accessed_at: datetime
    supports: list[str] = Field(default_factory=list)


class Uncertainty(StrictModel):
    field: str = Field(min_length=1)
    reason: str = Field(min_length=1)
    verification_question: str | None = None
    material_to_ranking: bool = True


class EscalationDecision(StrictModel):
    required: bool
    reason: str | None = None
    destination: str | None = None
    urgent: bool = False

    @model_validator(mode="after")
    def require_escalation_details(self) -> EscalationDecision:
        if self.required and (not self.reason or not self.destination):
            raise ValueError("required escalations need a reason and destination")
        return self


class SourceRecord(StrictModel):
    source_id: str = Field(pattern=r"^SRC-\d{3,}$")
    official_name: str = Field(min_length=1)
    submitted_url: str | None = None
    canonical_url: str = Field(min_length=1)
    organization: str = Field(min_length=1)
    jurisdiction: str = Field(min_length=1)
    service_geographies: list[str] = Field(default_factory=list)
    authority_class: str = Field(min_length=1)
    source_format: str = Field(min_length=1)
    resource_category: str = Field(min_length=1)
    primary_categories: list[str] = Field(default_factory=list)
    resource_types: list[ResourceType] = Field(min_length=1)
    inclusion_basis: list[InclusionBasis] = Field(min_length=1)
    audiences: AudienceClassification
    cost: CostClassification
    capability_tags: list[str] = Field(default_factory=list)
    core_user_value: str = Field(min_length=1)
    recommendation_triggers: list[str] = Field(default_factory=list)
    setup_requirements: list[str] = Field(default_factory=list)
    useful_kpis: list[str] = Field(default_factory=list)
    metric_boundaries: MetricBoundaries | None = None
    eligibility: list[str] = Field(default_factory=list)
    exclusions: list[str] = Field(default_factory=list)
    engagement_route: str | None = None
    status: SourceStatus
    last_verified: date | None = None
    refresh_trigger: str = Field(min_length=1)
    citation_rule: str = Field(min_length=1)
    known_failure_modes: list[str] = Field(default_factory=list)
    escalation_requirements: list[str] = Field(default_factory=list)
    live_verification_required: bool = False


class UserProfile(StrictModel):
    user_id: str | None = None
    user_type: UserType
    business_stage: BusinessStage | None = None
    goals: list[GoalType] = Field(default_factory=list)
    business_type: str | None = None
    location: str | None = None
    target_date: date | None = None
    experience: list[str] = Field(default_factory=list)
    available_time: str | None = None
    budget: str | None = None
    documentation_ready: list[str] = Field(default_factory=list)
    accessibility_constraints: list[str] = Field(default_factory=list)
    completed_resources: list[str] = Field(default_factory=list)
    active_applications: list[str] = Field(default_factory=list)
    outcomes_achieved: list[str] = Field(default_factory=list)
    blockers: list[str] = Field(default_factory=list)
    preferred_formats: list[str] = Field(default_factory=list)
    next_check_in: datetime | None = None


class GoalOption(StrictModel):
    goal: GoalType
    label: str = Field(min_length=1)
    rationale: str = Field(min_length=1)
    first_experiment: str = Field(min_length=1)
    success_signal: str = Field(min_length=1)
    questions_to_resolve: list[str] = Field(default_factory=list)


class GoalPlan(StrictModel):
    direction_is_clear: bool
    selected_goal: GoalType | None = None
    options: list[GoalOption] = Field(default_factory=list)
    known_constraints: list[str] = Field(default_factory=list)
    next_step: str = Field(min_length=1)

    @model_validator(mode="after")
    def require_selection_or_options(self) -> GoalPlan:
        if self.direction_is_clear and self.selected_goal is None:
            raise ValueError("a clear direction requires a selected goal")
        if not self.direction_is_clear and not self.options:
            raise ValueError("an unclear direction requires goal options")
        return self


class VerificationResult(StrictModel):
    source_id: str
    state: VerificationState
    checked_at: datetime
    verified_fields: dict[str, str] = Field(default_factory=dict)
    unresolved: list[Uncertainty] = Field(default_factory=list)
    citations: list[Citation] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


class CandidateMatch(StrictModel):
    source_id: str
    rank: int = Field(ge=1)
    score: float
    positive_factors: list[str] = Field(default_factory=list)
    constraints: list[str] = Field(default_factory=list)
    disqualifiers: list[str] = Field(default_factory=list)
    uncertainties: list[Uncertainty] = Field(default_factory=list)
    verification: VerificationResult | None = None

    @property
    def eligible_for_recommendation(self) -> bool:
        return not self.disqualifiers


class RecommendationBundle(StrictModel):
    profile: UserProfile
    goal: GoalType
    recommendations: list[CandidateMatch] = Field(min_length=1)
    comparison: list[str] = Field(default_factory=list)
    preparation_checklist: list[str] = Field(default_factory=list)
    questions_to_ask: list[str] = Field(default_factory=list)
    expected_timeline: str | None = None
    completion_kpi: str
    next_step: str
    citations: list[Citation] = Field(default_factory=list)
    escalation: EscalationDecision
    created_at: datetime


class ProgressRecord(StrictModel):
    record_id: str
    user_id: str
    goal: GoalType
    recommendation_source_ids: list[str] = Field(default_factory=list)
    preparation: list[str] = Field(default_factory=list)
    actions: list[str] = Field(default_factory=list)
    evidence: list[str] = Field(default_factory=list)
    state: ProgressState
    completion_kpi: str
    blockers: list[str] = Field(default_factory=list)
    next_stage: str | None = None
    updated_at: datetime
