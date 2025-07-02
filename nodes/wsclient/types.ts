export interface Logger {
	error: (...msg: any[]) => void | Promise<void>;
	warn: (...msg: any[]) => void | Promise<void>;
	info: (...msg: any[]) => void | Promise<void>;
	debug: (...msg: any[]) => void | Promise<void>;
	trace: (...msg: any[]) => void | Promise<void>;
}

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
