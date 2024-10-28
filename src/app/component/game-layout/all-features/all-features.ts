import { FeatureConfig } from "../../../interface/FeatureConfig";
import { TurnOrderComponent } from "../../games/ultimaRotta/features/TurnOrderComponent";


export const allFeatures: FeatureConfig[] = [
  {
    id: 'TURN_ORDER',
    description: 'Gestione ordine dei turni',
    component: TurnOrderComponent,
    icon: 'turn_slight_right',
    tooltip: 'Ordine dei turni',
    owner: ['Ultima-rotta'] // gameName in route
  },
  {
    id: 'TURN_ORDER_2',
    description: 'Gestione ordine dei turni',
    component: TurnOrderComponent,
    icon: 'turn_slight_right',
    tooltip: 'Ordine dei turni',
    owner: ['Ultima-rotta'] // gameName in route
  }
];
