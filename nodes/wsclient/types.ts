export interface Cache {
	set: (
		key: string | Symbol,
		value: any,
		expire?: number,
		options?: {
			namespace?: string;
		},
	) => Promise<boolean>;
	get: (
		key: string | Symbol,
		options?: {
			namespace?: string;
		},
	) => Promise<any>;
}
