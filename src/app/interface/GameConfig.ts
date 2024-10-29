import { FeatureConfig } from "./FeatureConfig";

export interface GameConfig {
    id: string;
    title: string;
    img?: string;
    css?: string;
    features: FeatureConfig[];
    
}
