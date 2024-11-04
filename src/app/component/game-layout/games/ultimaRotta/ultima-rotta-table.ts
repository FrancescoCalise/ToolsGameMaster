import { TableConfig } from "../../../../interface/TableConfig";

export const ultimaRottaWeapon: TableConfig[] = [
  {
    columns: ['ULTIMA_ROTTA.ARMOR_MELEE', 'ULTIMA_ROTTA.DAMAGE', 'ULTIMA_ROTTA.DISTANCE', 'ULTIMA_ROTTA.COST'],
    data: [
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.BARE_HANDS', 'ULTIMA_ROTTA.DAMAGE': '1', 'ULTIMA_ROTTA.DISTANCE': '', 'ULTIMA_ROTTA.COST': 'Gratis' },
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.KNUCKLE_DUSTER', 'ULTIMA_ROTTA.DAMAGE': 'D4', 'ULTIMA_ROTTA.DISTANCE': '', 'ULTIMA_ROTTA.COST': '30 R' },
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.KITCHEN_KNIFE', 'ULTIMA_ROTTA.DAMAGE': 'D4', 'ULTIMA_ROTTA.DISTANCE': '', 'ULTIMA_ROTTA.COST': '20 R' },
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.HUNTING_KNIFE', 'ULTIMA_ROTTA.DAMAGE': 'D6', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_10_M', 'ULTIMA_ROTTA.COST': '40 R' },
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.SHORT_SWORD', 'ULTIMA_ROTTA.DAMAGE': 'D8', 'ULTIMA_ROTTA.DISTANCE': '', 'ULTIMA_ROTTA.COST': '60 R' },
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.THROWING_AXE', 'ULTIMA_ROTTA.DAMAGE': 'D8', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_10_M', 'ULTIMA_ROTTA.COST': '80 R' },
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.SWORD_AXE_MACE', 'ULTIMA_ROTTA.DAMAGE': 'D10', 'ULTIMA_ROTTA.DISTANCE': '', 'ULTIMA_ROTTA.COST': '100 R' },
      { 'ULTIMA_ROTTA.ARMOR_MELEE': 'ULTIMA_ROTTA.WEAPONS.GREAT_AXE_SWORD', 'ULTIMA_ROTTA.DAMAGE': 'D12', 'ULTIMA_ROTTA.DISTANCE': '', 'ULTIMA_ROTTA.COST': '200 R' }
    ]
  },
  {
    columns: ['ULTIMA_ROTTA.ENERGY_WEAPONS', 'ULTIMA_ROTTA.DAMAGE', 'ULTIMA_ROTTA.TYPE', 'ULTIMA_ROTTA.DURATION', 'ULTIMA_ROTTA.COST'],
    data: [
      { 'ULTIMA_ROTTA.ENERGY_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.FULMILAMA', 'ULTIMA_ROTTA.DAMAGE': 'D12**', 'ULTIMA_ROTTA.TYPE': '', 'ULTIMA_ROTTA.DURATION': '3*', 'ULTIMA_ROTTA.COST': '300 R' },
      { 'ULTIMA_ROTTA.ENERGY_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.LIGHTNING', 'ULTIMA_ROTTA.DAMAGE': 'D20**', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.TWO_HANDS', 'ULTIMA_ROTTA.DURATION': '1*', 'ULTIMA_ROTTA.COST': '500 R' }
    ],
    notes: [
      { symbol: '*',  description: 'ULTIMA_ROTTA.NOTE.DURATION_RECHARGE' },
      { symbol: '**', description: 'ULTIMA_ROTTA.NOTE.DAMAGE_UNMODIFIABLE' }
    ]
  },
  {
    columns: ['ULTIMA_ROTTA.MECHANICAL_WEAPONS', 'ULTIMA_ROTTA.DAMAGE', 'ULTIMA_ROTTA.DISTANCE', 'ULTIMA_ROTTA.TYPE', 'ULTIMA_ROTTA.SHOTS', 'ULTIMA_ROTTA.COST'],
    data: [
      { 'ULTIMA_ROTTA.MECHANICAL_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.MINOR_NAILGUN', 'ULTIMA_ROTTA.DAMAGE': 'D6+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_20_M', 'ULTIMA_ROTTA.TYPE': '', 'ULTIMA_ROTTA.SHOTS': '10', 'ULTIMA_ROTTA.COST': '60 R' },
      { 'ULTIMA_ROTTA.MECHANICAL_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.RAPID_NAILGUN', 'ULTIMA_ROTTA.DAMAGE': 'D6+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_20_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.BURST_FIRE', 'ULTIMA_ROTTA.SHOTS': '20', 'ULTIMA_ROTTA.COST': '100 R' },
      { 'ULTIMA_ROTTA.MECHANICAL_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.HEAVY_NAILGUN', 'ULTIMA_ROTTA.DAMAGE': 'D10+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_50_M', 'ULTIMA_ROTTA.TYPE': '', 'ULTIMA_ROTTA.SHOTS': '6', 'ULTIMA_ROTTA.COST': '200 R' },
      { 'ULTIMA_ROTTA.MECHANICAL_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.GRAVE_NAILGUN', 'ULTIMA_ROTTA.DAMAGE': 'D12+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_100_M', 'ULTIMA_ROTTA.TYPE': '', 'ULTIMA_ROTTA.SHOTS': '20', 'ULTIMA_ROTTA.COST': '300 R' },
      { 'ULTIMA_ROTTA.MECHANICAL_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.WAR_NAILGUN', 'ULTIMA_ROTTA.DAMAGE': 'D12+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_100_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.BURST_FIRE', 'ULTIMA_ROTTA.SHOTS': '40', 'ULTIMA_ROTTA.COST': '500 R' },
      { 'ULTIMA_ROTTA.MECHANICAL_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.IMPALER', 'ULTIMA_ROTTA.DAMAGE': 'D20+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_50_M', 'ULTIMA_ROTTA.TYPE': '', 'ULTIMA_ROTTA.SHOTS': '1', 'ULTIMA_ROTTA.COST': '500 R' }
    ],
    notes: [
      { symbol: 'Note', description: 'ULTIMA_ROTTA.NOTE.MECHANICAL_WEAPONS' }
    ]
  },
  {
    columns: ['ULTIMA_ROTTA.SHOCK_WEAPONS', 'ULTIMA_ROTTA.DAMAGE', 'ULTIMA_ROTTA.DISTANCE', 'ULTIMA_ROTTA.TYPE', 'ULTIMA_ROTTA.COST'],
    data: [
      { 'ULTIMA_ROTTA.SHOCK_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.SPARKGUN', 'ULTIMA_ROTTA.DAMAGE': 'D10+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_100_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.TWO_HANDS', 'ULTIMA_ROTTA.COST': '500 R' },
      { 'ULTIMA_ROTTA.SHOCK_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.LIGHTNING_GUN', 'ULTIMA_ROTTA.DAMAGE': 'D10+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_100_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.TWO_HANDS_BURST_FIRE', 'ULTIMA_ROTTA.COST': '800 R' },
      { 'ULTIMA_ROTTA.SHOCK_WEAPONS': 'ULTIMA_ROTTA.WEAPONS.LIGHTNING_BLADE', 'ULTIMA_ROTTA.DAMAGE': 'D12+Man', 'ULTIMA_ROTTA.DISTANCE': 'ULTIMA_ROTTA.DIST_100_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.TWO_HANDS', 'ULTIMA_ROTTA.COST': '1000 R' }
    ],
    notes: [
      { symbol: 'Note', description: 'ULTIMA_ROTTA.NOTE.SHOCK_WEAPONS' }
    ]
  },
  {
    columns: ['ULTIMA_ROTTA.BOMBS', 'ULTIMA_ROTTA.DAMAGE', 'ULTIMA_ROTTA.RADIUS', 'ULTIMA_ROTTA.TYPE'],
    data: [
      { 'ULTIMA_ROTTA.BOMBS': 'ULTIMA_ROTTA.WEAPONS.B_BOOM', 'ULTIMA_ROTTA.DAMAGE': 'D20', 'ULTIMA_ROTTA.RADIUS': 'ULTIMA_ROTTA.RADIUS_10_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.INVAR_DAMAGE_THROW_20_M' },
      { 'ULTIMA_ROTTA.BOMBS': 'ULTIMA_ROTTA.WEAPONS.B_FLASH', 'ULTIMA_ROTTA.DAMAGE': 'D10', 'ULTIMA_ROTTA.RADIUS': 'ULTIMA_ROTTA.RADIUS_10_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.COURAGE_TEST_8_OR_PARALYZED_2D6' },
      { 'ULTIMA_ROTTA.BOMBS': 'ULTIMA_ROTTA.WEAPONS.B_GAS', 'ULTIMA_ROTTA.DAMAGE': 'VAR', 'ULTIMA_ROTTA.RADIUS': 'ULTIMA_ROTTA.RADIUS_10_M', 'ULTIMA_ROTTA.TYPE': 'ULTIMA_ROTTA.STRENGTH_TEST_8_PENALTY_2D6' }
    ],
    notes: [
      { symbol: 'Note', description: 'ULTIMA_ROTTA.NOTE.BOMB_WEAPONS' },
      { symbol: 'Inermme',  description: 'ULTIMA_ROTTA.NOTE.INERT_EFFECT' }
    ]
  }
];


export const ultimaRottaCriticDamage: TableConfig[] = [
  {
    columns: ['ULTIMA_ROTTA.TABLE.CRITIC.RESULT', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS'],
    data: [
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '7', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.BODY', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_1_PS_MAX' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '8', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.HEAD', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_1_PERCEPTION' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '9', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.RIGHT_ARM', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_1_STRENGTH_MANUALITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '10', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.LEFT_ARM', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_1_STRENGTH_MANUALITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '11', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.RIGHT_LEG', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_1_AGILITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '12', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.LEFT_LEG', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_1_AGILITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '13', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.BODY', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_2_PS_MAX' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '14', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.HEAD', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_1_PERCEPTION_INTELLIGENCE' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '15', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.RIGHT_ARM', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_2_STRENGTH_MANUALITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '16', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.LEFT_ARM', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_2_STRENGTH_MANUALITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '17', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.RIGHT_LEG', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_2_AGILITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '18', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.LEFT_LEG', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_2_AGILITY' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '19', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.BODY', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_3_PS_MAX' },
      { 'ULTIMA_ROTTA.TABLE.CRITIC.RESULT': '20', 'ULTIMA_ROTTA.TABLE.CRITIC.CRITIC_AREA': 'ULTIMA_ROTTA.TABLE.CRITIC.HEAD', 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS': 'ULTIMA_ROTTA.TABLE.CRITIC.MODIFIERS_MINUS_2_PERCEPTION_INTELLIGENCE' }
    ],
    notes: [
      { symbol: 'ULTIMA_ROTTA.TABLE.CRITIC.NOTES', description: 'ULTIMA_ROTTA.TABLE.CRITIC.NOTE_NO_EFFECT_1_6' },
      { symbol: '->', description: 'ULTIMA_ROTTA.TABLE.CRITIC.NOTE_EFFECT_7_20_INERT_PLUS_MODIFIERS' }
    ]
  }
];

