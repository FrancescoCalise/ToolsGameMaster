import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PNG_5E } from '../component/game-layout/games/dungeonAndDragns5e/interface/png_5e-interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvertXmlToJson {

  monsterData: PNG_5E[] | null = null

  constructor(private http: HttpClient) {

  }

  loadAndConvertXML(): void {
    this.http.get('/assets/dnd/bestiary/bestiary.xml', { responseType: 'text' }) // Adjust the path to your XML file
      .pipe(
        map((xmlData: string) => this.parseXMLToJson(xmlData))
      )
      .subscribe((json: PNG_5E[]) => {
        this.monsterData = json;
        this.downloadJson();
      });
  }

  parseXMLToJson(xmlData: string): PNG_5E[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
    const monsterNodes = xmlDoc.getElementsByTagName('monster');
    const monsters: PNG_5E[] = [];

    Array.from(monsterNodes).forEach(monsterNode => {
      const monster = this.processSingleNode(monsterNode);
      monsters.push(monster);
    });
    return monsters;
  }

  processSingleNode(xmlDoc: Element): any {
    const skillsString = xmlDoc.getElementsByTagName('skill')[0]?.textContent || '';
    const skillsArray = skillsString.split(',').map(skill => skill.trim());
    const spellSlotsArray = Array.from(xmlDoc.getElementsByTagName('slots'))
    .flatMap(spellSlotNode => 
        (spellSlotNode.textContent || '0')
            .split(',')
            .map(slot => parseInt(slot.trim(), 10))
    );
    const spells = xmlDoc.getElementsByTagName('spells')[0]?.textContent || '';
    const spellsArray = spells.split(/[.,]/).map(spell => spell.trim());

    let spellPng: Array<{
      level: number;
      spellName: string;
    }> = [];

    spellsArray.forEach(element => {
      spellPng.push({ level: 0, spellName: element });
    });

    return {
      name: xmlDoc.getElementsByTagName('name')[0]?.textContent || '',
      size: xmlDoc.getElementsByTagName('size')[0]?.textContent || '',
      type: xmlDoc.getElementsByTagName('type')[0]?.textContent || '',
      alignment: xmlDoc.getElementsByTagName('alignment')[0]?.textContent || '',
      armorClass: xmlDoc.getElementsByTagName('ac')[0]?.textContent || '',
      hitPoints: xmlDoc.getElementsByTagName('hp')[0]?.textContent || '',
      speed: xmlDoc.getElementsByTagName('speed')[0]?.textContent || '',
      attributes: {
        strength: parseInt(xmlDoc.getElementsByTagName('str')[0]?.textContent || '0', 0),
        dexterity: parseInt(xmlDoc.getElementsByTagName('dex')[0]?.textContent || '0', 0),
        constitution: parseInt(xmlDoc.getElementsByTagName('con')[0]?.textContent || '0', 0),
        intelligence: parseInt(xmlDoc.getElementsByTagName('int')[0]?.textContent || '0', 0),
        wisdom: parseInt(xmlDoc.getElementsByTagName('wis')[0]?.textContent || '0', 0),
        charisma: parseInt(xmlDoc.getElementsByTagName('cha')[0]?.textContent || '0', 0)
      },
      save: xmlDoc.getElementsByTagName('save')[0]?.textContent || '',
      skills: skillsArray,
      damageResistances: xmlDoc.getElementsByTagName('damageResistances')[0]?.textContent || '',
      damageVulnerabilities: xmlDoc.getElementsByTagName('damageVulnerabilities')[0]?.textContent || '',
      damageImmunities: xmlDoc.getElementsByTagName('damageImmunities')[0]?.textContent || '',
      conditionImmunities: xmlDoc.getElementsByTagName('conditionImmunities')[0]?.textContent || '',
      senses: xmlDoc.getElementsByTagName('senses')[0]?.textContent || '',
      passivePerception: parseInt(xmlDoc.getElementsByTagName('passivePerception')[0]?.textContent || '0', 10),
      languages: xmlDoc.getElementsByTagName('languages')[0]?.textContent || '',
      challengeRating: xmlDoc.getElementsByTagName('cr')[0]?.textContent || '',
      traits: Array.from(xmlDoc.getElementsByTagName('trait')).map(traitNode => ({
        name: traitNode.getElementsByTagName('name')[0]?.textContent || '',
        description: Array.from(traitNode.getElementsByTagName('text'))
                    .map(textNode => textNode.textContent || '')
                    .join('\n'),
        attack: traitNode.getElementsByTagName('attack')[0]?.textContent || ''
      })),
      actions: Array.from(xmlDoc.getElementsByTagName('action')).map(actionNode => ({
        name: actionNode.getElementsByTagName('name')[0]?.textContent || '',
        description: actionNode.getElementsByTagName('text')[0]?.textContent || '',
        attack: actionNode.getElementsByTagName('attack')[0]?.textContent || ''
      })),
      legendaryActions: Array.from(xmlDoc.getElementsByTagName('legendary')).map(legendaryActionNode => ({
        name: legendaryActionNode.getElementsByTagName('name')[0]?.textContent || '',
        description: legendaryActionNode.getElementsByTagName('text')[0]?.textContent || ''
      })),
      spells: spellPng,
      spellSlots: spellSlotsArray
    } as PNG_5E;
  }


  downloadJson(): void {
    if (this.monsterData) {
      const jsonString = JSON.stringify(this.monsterData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'monster.json';
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    }
  }
}