export type StatusType = "scheduled" | "resolved" | "inprogress" | "completed";

export interface IncidentUpdate {
	id: string,
	status: StatusType,
	body: string,		// HTML
	incident_id: string,	// Maintenances.id
	created_at: Date,
	updated_at: Date | null,
	display_at: Date | null,
	affected_components: {
		code: string,	// hmm
		name: string,
		old_status: "operational",	// TODO
		new_status: "operational",
	}[],
	deliver_notifications: true,
	custom_tweet: string | null,	// link?
	tweet_id: string | null,
}

export interface Component {
	id: string,
	name: string,
	status: "operational",	// TODO,
	created_at: Date,
	updated_at: Date | null,
	position: number,
	description: string | null,
	showcase: boolean,
	start_date: Date | null,
	group_id: string,
	page_id: string,
	group: boolean,
	only_show_if_degraded: boolean,
}

export interface Maintenances {
	id: string,
	name: string,
	status: StatusType,
	created_at: Date,
	updated_at: Date | null,
	monitoring_at: Date | null,
	resolved_at: Date | null,
	impact: "maintenance" | "minor" | "major" | "critical" | "none",
	shortlink: string,
	started_at: Date | null,
	page_id: string,
	incident_updates: IncidentUpdate[],
	components: Component[],
	scheduled_for: Date,
	scheduled_until: Date,
}

export interface UpcomingResponse {
	page: {
		id: string,
		name: string,
		url: string,
		time_zone: string,
		updated_at: Date | null;
	},
	scheduled_maintenances: Maintenances[],
}