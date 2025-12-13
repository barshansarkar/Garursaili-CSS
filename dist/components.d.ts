export interface ComponentBase {
    base: Record<string, any>;
}
export declare const components: Record<string, ComponentBase>;
export declare function generateComponentVariants(baseComponents: Record<string, ComponentBase>, count?: number): Record<string, ComponentBase>;
export declare const allComponents: Record<string, ComponentBase>;
export declare const enhancedAnimations: string;
