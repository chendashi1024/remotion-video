export type VisualTheme = "matrix" | "matrix_red_alert" | "clean_dark";

export type VisualLayout = "left" | "right" | "center" | "full" | "split";

export type VisualIntensity = "low" | "medium" | "high";

export type EnterAnimation = "scan_in" | "fade_slide" | "glitch_reveal" | "typewriter";

export type ExitAnimation = "fade_out" | "slide_out" | "glitch_out";

export type FocusAnimation = "highlight_box" | "zoom_focus" | "step_glow" | "count_up" | "line_draw";

export type AssetMode =
  | "none"
  | "auto_web_capture"
  | "auto_web_search_then_capture"
  | "user_asset_folder_scan"
  | "user_required";

export type AssetFallbackMode =
  | "auto_web_capture"
  | "auto_web_search_then_capture"
  | "user_asset_folder_scan"
  | "ask_user_for_asset";

export type AssetOwner = "codex" | "user";

export type AssetLowConfidenceAction = "mark_action_required" | "fallback_to_text_card" | "skip_asset";

export type SourceType =
  | "official_website"
  | "official_docs"
  | "public_article"
  | "social_post"
  | "dashboard"
  | "chat"
  | "paper"
  | "unknown";

export type AssetRecordType =
  | "webpage_screenshot"
  | "pricing_page"
  | "official_docs"
  | "chat_screenshot"
  | "dashboard_screenshot"
  | "social_comment"
  | "product_ui"
  | "workflow_diagram"
  | "chart_or_table"
  | "video_frame"
  | "unknown";

export type AssetQuality = "excellent" | "usable" | "weak" | "unusable";

export type PrivacyRisk = "low" | "medium" | "high";

export type ExpectedAssetType = "screenshot" | "video" | "url" | "text" | "data";

export type BaseVisualComponentProps = {
  sceneId: string;
  durationInFrames: number;
  fps: number;
  theme?: VisualTheme;
  layout?: VisualLayout;
  intensity?: VisualIntensity;
  enterAnimation?: EnterAnimation;
  exitAnimation?: ExitAnimation;
  safeArea?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export type AssetStrategy = {
  required: boolean;
  preferred_mode: AssetMode;
  fallback_modes: AssetFallbackMode[];
  owner_priority: AssetOwner[];
  source_rules: {
    prefer: string[];
    avoid: string[];
  };
  validation: {
    must_read_image: boolean;
    must_match_claim: boolean;
    minimum_confidence: number;
    if_confidence_low: AssetLowConfidenceAction;
    do_not_fabricate: boolean;
  };
  asset_prompt?: {
    what_to_find: string;
    focus_area: string;
    what_it_should_prove: string;
  };
};

export type AnimationPlan = {
  enter: EnterAnimation;
  focus?: FocusAnimation;
  exit: ExitAnimation;
};

export type RemotionSceneBrief = {
  scene_id: string;
  start_time?: string;
  duration_seconds: number;
  narration_text: string;
  narration_goal: string;
  visual_goal: string;
  component: string;
  component_props: Record<string, unknown>;
  asset_strategy: AssetStrategy;
  animation?: AnimationPlan;
  risk_notes?: string[];
};

export type AssetRecord = {
  asset_id: string;
  file_path: string;
  type: AssetRecordType | string;
  source_type: SourceType | string;
  source_url?: string;
  captured_at?: string;
  detected_content: string;
  detected_text?: string[];
  used_for_scene?: string;
  intended_component?: string;
  claim_supported?: string;
  focus_area?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
  };
  confidence: number;
  quality: AssetQuality;
  privacy_risk: PrivacyRisk;
  recommended_action?: string;
};

export type AssetManifest = {
  assets: AssetRecord[];
};

export type ActionRequiredItem = {
  scene_id: string;
  component: string;
  reason: string;
  request_to_user: string;
  expected_asset_type: ExpectedAssetType;
  focus_hint?: string;
  fallback_plan?: string;
};

export type ActionRequiredFile = {
  items: ActionRequiredItem[];
};

export const defaultAssetStrategy: AssetStrategy = {
  required: false,
  preferred_mode: "none",
  fallback_modes: [],
  owner_priority: ["codex"],
  source_rules: {
    prefer: [],
    avoid: [],
  },
  validation: {
    must_read_image: false,
    must_match_claim: false,
    minimum_confidence: 1,
    if_confidence_low: "fallback_to_text_card",
    do_not_fabricate: true,
  },
};

export const evidenceAssetStrategy: AssetStrategy = {
  required: true,
  preferred_mode: "auto_web_capture",
  fallback_modes: ["auto_web_search_then_capture", "user_asset_folder_scan", "ask_user_for_asset"],
  owner_priority: ["codex", "user"],
  source_rules: {
    prefer: ["official_website", "official_docs", "public_product_page"],
    avoid: ["unknown_blog", "outdated_screenshot", "login_required_page", "private_dashboard"],
  },
  validation: {
    must_read_image: true,
    must_match_claim: true,
    minimum_confidence: 0.8,
    if_confidence_low: "mark_action_required",
    do_not_fabricate: true,
  },
};
