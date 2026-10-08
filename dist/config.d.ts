export interface GarurConfig {
    breakpoints?: Record<string, string>;
    palette?: Record<string, any>;
    darkMode?: "class" | "media";
    important?: boolean;
    semanticColors?: boolean;
    semanticOverrides?: Record<string, string>;
    [key: string]: any;
}
declare const DEFAULT_CONFIG: GarurConfig;
export declare function loadConfig(): GarurConfig;
export declare function applyConfig(cfg: GarurConfig): void;
export { DEFAULT_CONFIG };
export default DEFAULT_CONFIG;
