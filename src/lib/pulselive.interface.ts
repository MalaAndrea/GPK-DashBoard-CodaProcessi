// results/seasons
export interface PulseLive_Season {
    id: string;
    name: string | null;
    year: number;
    current: boolean;
}

// /results/events
export interface Country {
    iso: string;
    name: string;
    region_iso: string;
}

export interface EventFile {
    url: string;
    menu_position: number;
}

export interface EventFiles {
    circuit_information: EventFile;
    podiums: EventFile;
    pole_positions: EventFile;
    nations_statistics: EventFile;
    riders_all_time: EventFile;
}

export interface Circuit {
    id: string;
    name: string;
    legacy_id: number;
    place: string;
    nation: string;
}

export interface LegacyId {
    categoryId: number;
    eventId: number;
}

export interface PulseLive_Event {
    country: Country;
    event_files: EventFiles;
    circuit: Circuit;
    test: boolean;
    sponsored_name: string;
    date_end: string;
    toad_api_uuid: string;
    date_start: string;
    name: string;
    legacy_id: LegacyId[];
    season: PulseLive_Season;
    short_name: string;
    id: string;
    status: string;
}

// /results/sessions
export interface PulseLive_Condition {
    track: string;
    air: string;
    humidity: string;
    ground: string;
    weather: string;
}

export interface PulseLive_SessionFile {
    url: string;
    menu_position: number;
}

export interface PulseLive_SessionFiles {
    classification: PulseLive_SessionFile;
    analysis: PulseLive_SessionFile;
    average_speed: PulseLive_SessionFile;
    fast_lap_sequence: PulseLive_SessionFile;
    lap_chart: PulseLive_SessionFile;
    analysis_by_lap: PulseLive_SessionFile;
    fast_lap_rider: PulseLive_SessionFile;
    grid: PulseLive_SessionFile;
    session: PulseLive_SessionFile;
    world_standing: PulseLive_SessionFile;
    best_partial_time: PulseLive_SessionFile;
    maximum_speed: PulseLive_SessionFile;
    combined_practice: PulseLive_SessionFile;
    combined_classification: PulseLive_SessionFile;
}

export interface PulseLive_Category {
    id: string;
    legacy_id: number;
    name: string;
}

export interface PulseLive_Circuit {
    id: string;
    name: string;
    legacy_id: number;
    place: string;
    nation: string;
}

export interface PulseLive_Country {
    iso: string;
    name: string;
    region_iso: string;
}

export interface PulseLive_SessionEvent {
    id: string;
    name: string;
    sponsored_name: string;
    short_name: string;
    test: boolean;
    season: string;
    circuit: PulseLive_Circuit;
    country: PulseLive_Country;
}

export interface PulseLive_Session {
    date: string;
    number: number;
    condition: PulseLive_Condition;
    circuit: string;
    session_files: PulseLive_SessionFiles;
    id: string;
    type: string;
    category: PulseLive_Category;
    event: PulseLive_SessionEvent;
    status: string;
}

// /results/session/{id}/classification

export interface PulseLive_Country {
    iso: string;
    name: string;
    region_iso: string;
}

export interface PulseLive_Rider {
    id: string;
    full_name: string;
    country: PulseLive_Country;
    legacy_id: number;
    number: number;
    riders_api_uuid: string;
}

export interface PulseLive_Season {
    id: string;
    year: number;
    current: boolean;
}

export interface PulseLive_Team {
    id: string;
    name: string;
    legacy_id: number;
    season: PulseLive_Season;
}

export interface PulseLive_Constructor {
    id: string;
    name: string;
    legacy_id: number;
}

export interface PulseLive_Gap {
    first: string;
    lap: string;
}

export interface PulseLive_ClassificationEntry {
    id: string;
    points: number;
    position: number;
    rider: PulseLive_Rider;
    team: PulseLive_Team;
    constructor: PulseLive_Constructor;
    average_speed: number;
    gap: PulseLive_Gap;
    total_laps: number;
    time: string;
    status: string;
}


