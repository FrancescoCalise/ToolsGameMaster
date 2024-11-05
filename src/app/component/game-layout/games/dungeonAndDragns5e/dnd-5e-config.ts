import { FeatureConfig } from "../../../../interface/FeatureConfig";
import { GameConfig } from "../../../../interface/GameConfig";
import { SessionManagerComponenet } from "../../feature-sitemap/session-manager/session-manger.component";
import { TurnOrderComponent } from "../../feature-sitemap/turn-order/turn-order.component";


export const dnd5eConfig: GameConfig =
{
  id: 'dungeon-and-dragons-5e',
  title: 'DUNGEON_AND_DRAGONS_5E.TITLE',
  img: 'https://upload.wikimedia.org/wikipedia/it/d/d2/DnD_5e_logo.png',
  css: 'logo-dnd-5e',
  features: [
    {
      id: 'SESSION_MANAGER',
      component: SessionManagerComponenet,
      icon: 'turn_slight_right',
      changePage: true
    },
    {
      id: 'TURN_ORDER',
      component: TurnOrderComponent,
      icon: 'turn_slight_right',
      changePage: false
    },
  ] as FeatureConfig[]
};
