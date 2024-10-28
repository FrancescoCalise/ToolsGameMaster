import { FeatureConfig } from "../../../../interface/FeatureConfig";
import { TurnOrderComponent } from "../../games/ultimaRotta/features/TurnOrderComponent";


export const allFeatures: FeatureConfig[] = [
  {
    id: 'TURN_ORDER',
    component: TurnOrderComponent,
    icon: 'turn_slight_right',
    owner: ['Ultima-rotta'], // gameName in route
    changePage: false
  },
  {
    id: 'SHOW_WEAPONS',
    icon: 'turn_slight_right',
    owner: ['Ultima-rotta'], // gameName in route
    changePage: true
  },
  {
    id: 'SHOW_CRITIC_DAMAGE',
    icon: 'turn_slight_right',
    owner: ['Ultima-rotta'], // gameName in route
    changePage: true
  },
  {
    id: 'CREATE_CHARACTER_ULTIMA_ROTTA',
    icon: 'turn_slight_right',
    owner: ['Ultima-rotta'], // gameName in route
    changePage: true
  }
];
