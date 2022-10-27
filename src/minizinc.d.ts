declare class Model {
  /**
   * Create a new model.
   */
  constructor();
  /**
   * Add a snippet of code to the model.
   *
   * @param model MiniZinc code as a string
   * @returns The filename of the snippet (may be useful to identify sources of errors)
   */
  addString(model: string): string;
  /**
   * Adds a snippet of data to the model.
   *
   * @param dzn DataZinc input as a string
   * @returns The filename of the snippet (may be useful to identify sources of errors)
   */
  addDznString(dzn: string): string;

  /**
   * Adds data to the model in JSON format.
   *
   * @param data The data as an object in MiniZinc JSON data input format
   * @returns The filename of the snippet (may be useful to identify sources of errors)
   */
  addJson(data: object): string;

  /**
   * Makes the given string contents available to MiniZinc using the given filename.
   *
   * @param filename The file name to use
   * @param contents The contents of the file
   * @param use Whether to add this file as an argument to the MiniZinc command
   */
  addFile(filename: string, contents: string, use?: boolean): void;

  /**
   * Check for errors in the model using `--model-check-only`.
   *
   * @param options Options to pass to MiniZinc in parameter configuration file format
   * @returns The errors in the model
   */
  check(options: Configuration): Promise<ErrorMessage[]>;

  /**
   * Get the model interface using `--model-interface-only`.
   * @param options Options to pass to MiniZinc in parameter configuration file format
   * @returns The model interface
   */
  interface(options: Configuration): Promise<ModelInterface>;

  /**
   * Compile this model to FlatZinc.
   * @param options Options to pass to MiniZinc in parameter configuration file format
   */
  compile(options: Configuration): CompilationProgress;

  /**
   * Solve this model.
   * @param options Options to pass to MiniZinc in parameter configuration file format
   * @param jsonOutput Whether to use `--output-mode json`
   */
  solve(options: Configuration, jsonOutput?: boolean): SolveProgress;
  
  /**
   * List of files to include in MiniZinc command.
   * 
   * This generally does not need to be accessed as it is automatically populated
   * when using the `addXXX` functions.
   */
   toRun: string[];
}

/**
 * Options configuration in parameter configuration format
 */
export interface Configuration {
  solver?: string;
  [arg: string]: any;
}

/**
 * An error message from MiniZinc
 */
export interface ErrorMessage {
  type: "error";
  what: string;
  message: string;
  location?: Location;
  stack?: StackItem[];
  [key: string]: any;
}

/**
 * A warning message from MiniZinc
 */
export interface WarningMessage {
  type: "warning";
  what: string;
  message: string;
  location?: Location;
  stack?: StackItem[];
  [key: string]: any;
}

/**
 * A location in a file
 */
export interface Location {
  filename: string;
  firstLine: number;
  firstColumn: number;
  lastLine: number;
  lastColumn: number;
}

/**
 * A stack trace item
 */
export interface StackItem {
  location: Location;
  isCompIter: boolean;
  description: string;
}

/**
 * Model interface output
 */
export interface ModelInterface {
  type: "interface";
  input: { [name: string]: VarType };
  output: { [name: string]: VarType };
  method: "sat" | "min" | "max";
  has_output_item: boolean;
  included_files: string[];
  globals: string[];
}

/**
 * Type definition of a variable/parameter
 */
export interface VarType {
  type: "int" | "float" | "bool" | "string";
  dim?: number;
  set?: true;
}

/**
 * Solution message
 */
export interface SolutionMessage {
  type: "solution";
  time?: number;
  output: { [section: string]: string };
  sections: string[];
}

/**
 * Checker message
 */
export interface CheckerMessage {
  type: "checker";
  time?: number;
  output: { [section: string]: string };
  sections: string[];
}

/**
 * Statuses
 */
export type Status =
  | "ALL_SOLUTIONS"
  | "OPTIMAL_SOLUTION"
  | "UNSATISFIABLE"
  | "UNBOUNDED"
  | "UNSAT_OR_UNBOUNDED"
  | "UNKNOWN"
  | "ERROR";

/**
 * Status message
 */
export interface StatusMessage {
  type: "status";
  status: Status;
  time?: number;
}

/**
 * Statistics message
 */
export interface StatisticsMessage {
  type: "statistics";
  statistics: { [key: string]: any };
}

/**
 * Timestamp message
 */
export interface TimestampMessage {
  type: "time";
  time: number;
}

/**
 * Trace message
 */
export interface TraceMessage {
  type: "trace";
  section: string;
  message: string;
}

/** Exit message */
export interface ExitMessage {
  type: "exit";
  code: number;
  stdout?: string;
  stderr?: string;
  outputFiles?: { [filename: string]: string };
}

/**
 * Thenable controller for a compilation request
 */
export interface CompilationProgress extends PromiseLike<string> {
  /** Cancel compilation */
  cancel(): void;
  /** Listen for an event */
  on(event: "statistics", callback: (e: StatisticsMessage) => void): void;
  on(event: "trace", callback: (e: TraceMessage) => void): void;
  on(event: "error", callback: (e: ErrorMessage) => void): void;
  on(event: "warning", callback: (e: WarningMessage) => void): void;
  on(event: "exit", callback: (e: ExitMessage) => void): void;
  on(event: string, callback: (e: object) => void): void;
  /** Stop listening for an event */
  off<T>(event: string, callback: (e: T) => void): void;
}

/**
 * Thenable controller for a solve request
 */
export interface SolveProgress extends PromiseLike<SolveResult> {
  /** Cancel solving */
  cancel(): void;
  /** Listen for an event */
  on(event: "solution", callback: (e: SolutionMessage) => void): void;
  on(event: "checker", callback: (e: CheckerMessage) => void): void;
  on(event: "status", callback: (e: StatusMessage) => void): void;
  on(event: "statistics", callback: (e: StatisticsMessage) => void): void;
  on(event: "timestamp", callback: (e: TimestampMessage) => void): void;
  on(event: "trace", callback: (e: TraceMessage) => void): void;
  on(event: "error", callback: (e: ErrorMessage) => void): void;
  on(event: "warning", callback: (e: WarningMessage) => void): void;
  on(event: "exit", callback: (e: ExitMessage) => void): void;
  on(event: string, callback: (e: object) => void): void;
  /** Stop listening for an event */
  off<T>(event: string, callback: (e: T) => void): void;
}

/**
 * Result of solving the model
 */
export interface SolveResult {
  status: Status;
  solution: SolutionMessage | null;
  statistics: { [key: string]: any };
}

declare global {
  /** MiniZinc WASM API */
  var MiniZinc: {
    /** The main class for manipulating MiniZinc models */
    Model: typeof Model;
    /**
     * Get the version of MiniZinc
     */
    version: () => Promise<string>;
  };
}
