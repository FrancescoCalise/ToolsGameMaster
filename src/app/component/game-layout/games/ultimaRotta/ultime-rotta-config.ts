import { FeatureConfig } from "../../../../interface/FeatureConfig";
import { GameConfig } from "../../../../interface/GameConfig";
import { SessionManagerComponenet } from "../../../session-manager/session-manger.component";
import { TurnOrderComponent } from "./features/turn-order/turn-order.component";


export const ultimeRottaConfig: GameConfig =
{
  id: 'Ultima-rotta',
  title: 'ULTIMA_ROTTA.TITLE',
  img: 'https://static.wixstatic.com/media/5738c7_b85f94f134a14da2918869dfe0bd7f6c~mv2.png/v1/fill/w_502,h_278,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo%20lur_edited.png',
  css: 'ultima-rotta-navbar-title',
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
    {
      id: 'SHOW_WEAPONS',
      icon: 'turn_slight_right',
      changePage: true
    },
    {
      id: 'SHOW_CRITIC_DAMAGE',
      icon: 'turn_slight_right',
      changePage: true
    },
    {
      id: 'CREATE_CHARACTER_ULTIMA_ROTTA',
      icon: 'turn_slight_right',
      changePage: true
    }
  ] as FeatureConfig[]
};