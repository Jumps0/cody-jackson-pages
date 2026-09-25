import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as echarts from 'echarts';
import ChatData from './assets/chatdata.json';
import StatisticsData from './assets/statistics.json';
import LandscapeViewer from './landscape/LandscapeViewer';
import leftArrowIcon from './assets/icon_arrow_left.png';
import rightArrowIcon from './assets/icon_arrow_right.png';
import './DnDPage.css';
import './dicefont/dicefont.css';

type ChartOption = echarts.EChartsOption;

const fallbackChartColors = ['#f0a35b', '#6ec6ca', '#e87979', '#a8c77d', '#b59add', '#e4c66a', '#82a6df', '#d78fbd', '#8fc79a', '#d3a176'];

function getPlayerColor(player: string, index = 0): string {
  const colorName = player;
  const color = StatisticsData.playerColorScheme[colorName as keyof typeof StatisticsData.playerColorScheme];
  return color ? color.slice(0, 7) : fallbackChartColors[index % fallbackChartColors.length];
}

function getCumulativeValues(values: (number | null)[]): (number | null)[] {
  let total = 0;
  return values.map((value) => {
    if (value === null) return null;
    total += value;
    return total;
  });
}

function getLatestValue(values: (number | null)[]): number {
  return [...values].reverse().find((value): value is number => value !== null) ?? Number.NEGATIVE_INFINITY;
}

function StatisticsChart({ option }: { option: ChartOption }) {
  const chartElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartElement.current) return;
    const chart = echarts.init(chartElement.current);
    chart.setOption(option);
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartElement.current);
    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div className="statistics-chart" ref={chartElement} />;
}

function createAxisOptions(horizontal = false): ChartOption {
  return {
    animationDuration: 650,
    color: fallbackChartColors,
    textStyle: { fontFamily: 'inherit' },
    grid: { top: 48, right: 24, bottom: 42, left: horizontal ? 112 : 48, containLabel: true },
    tooltip: { trigger: 'axis', confine: true },
    xAxis: { type: horizontal ? 'value' : 'category', axisLabel: { color: '#94a4af', fontSize: 12, interval: horizontal ? 'auto' : 0 }, axisLine: { lineStyle: { color: 'rgba(196, 207, 214, .16)' } }, splitLine: { show: horizontal, lineStyle: { color: 'rgba(196, 207, 214, .09)' } } },
    yAxis: { type: horizontal ? 'category' : 'value', nameLocation: 'end', nameGap: 30, axisLabel: { color: '#94a4af', fontSize: 12 }, axisLine: { show: false }, splitLine: { show: !horizontal, lineStyle: { color: 'rgba(196, 207, 214, .09)' } } },
  };
}

function StatisticsDashboard() {
  const wealth = Object.entries(StatisticsData.currentPlayerWealth);
  const downs = Object.entries(StatisticsData.downsByPlayer);
  const kills = Object.entries(StatisticsData.killsPerAdventure).reverse();
  const magicItems = StatisticsData.magicItemsOverTime;
  const hpLevels = StatisticsData.hpPerLevel;
  const messageShares = Object.entries(StatisticsData.discordMessagesPerPerson).filter(([name]) => name !== 'Total');
  const messageSharesR20 = Object.entries(StatisticsData.roll20MessagesPerPerson).filter(([name]) => name !== 'Total');
  const allTimeMessages = StatisticsData.allTimeDiscordMessages;
  const wealthAxis = createAxisOptions();
  const horizontalAxis = createAxisOptions(true);

  const wealthOption: ChartOption = { ...wealthAxis, xAxis: { ...wealthAxis.xAxis, data: wealth.map(([name]) => name) }, yAxis: { ...wealthAxis.yAxis, name: 'Gold', nameTextStyle: { color: '#94a4af' } }, series: [{ type: 'bar', data: wealth.map(([name, value], index) => ({ value, itemStyle: { color: getPlayerColor(name, index), borderRadius: [3, 3, 0, 0] } })), barMaxWidth: 34 }] };
  const downsOption: ChartOption = { ...wealthAxis, xAxis: { ...wealthAxis.xAxis, data: downs.map(([name]) => name) }, yAxis: { ...wealthAxis.yAxis, name: 'Downs', nameTextStyle: { color: '#94a4af' } }, series: [{ type: 'bar', data: downs.map(([name, value], index) => ({ value, itemStyle: { color: getPlayerColor(name, index), borderRadius: [3, 3, 0, 0] } })), barMaxWidth: 34 }] };
  const killsOption: ChartOption = { ...horizontalAxis, grid: { top: 28, right: 70, bottom: 42, left: 22, containLabel: true }, xAxis: { ...horizontalAxis.xAxis, name: 'Kills', nameGap: 18, nameTextStyle: { color: '#94a4af' } }, yAxis: { ...horizontalAxis.yAxis, data: kills.map(([name]) => name) }, series: [{ type: 'bar', data: kills.map(([, value]) => value), barMaxWidth: 22, itemStyle: { borderRadius: [0, 3, 3, 0], color: '#df6c8f' } }] };
  const magicOption: ChartOption = { ...wealthAxis, legend: { type: 'scroll', bottom: 0, textStyle: { color: '#94a4af' } }, grid: { top: 48, right: 22, bottom: 58, left: 48, containLabel: true }, xAxis: { ...wealthAxis.xAxis, data: magicItems.adventures }, yAxis: { ...wealthAxis.yAxis, name: 'Items', nameTextStyle: { color: '#94a4af' } }, tooltip: { trigger: 'axis', confine: true }, series: Object.entries(magicItems.players).map(([name, values], index) => ({ name, type: 'line', connectNulls: false, smooth: true, symbolSize: 6, data: getCumulativeValues(values), itemStyle: { color: getPlayerColor(name, index) } })) };
  const sortedHpPlayers = Object.entries(hpLevels.players).sort(([, left], [, right]) => getLatestValue(right) - getLatestValue(left));
  const hpOption: ChartOption = { ...wealthAxis, animationDuration: 10000, grid: { top: 48, right: 140, bottom: 58, left: 48, containLabel: true }, xAxis: { ...wealthAxis.xAxis, data: hpLevels.levels.map(String), name: 'Level', nameLocation: 'middle', nameGap: 30 }, yAxis: { ...wealthAxis.yAxis, name: 'HP', nameTextStyle: { color: '#94a4af' } }, tooltip: { order: 'valueDesc', trigger: 'axis', confine: true }, series: sortedHpPlayers.map(([name, values], index) => ({ name, type: 'line', connectNulls: false, smooth: true, showSymbol: false, data: values, itemStyle: { color: getPlayerColor(name, index) }, endLabel: { show: true, formatter: '{a}: {c}', color: '#94a4af' }, labelLayout: { moveOverlap: 'shiftY' }, emphasis: { focus: 'series' } })) };
  const messageSharesOption: ChartOption = { color: messageShares.map(([name], index) => getPlayerColor(name, index)), tooltip: { trigger: 'item', confine: true, formatter: '{b}<br/>{c} messages ({d}%)' }, legend: { type: 'scroll', orient: 'vertical', right: 0, top: 'middle', textStyle: { color: '#94a4af' } }, series: [{ type: 'pie', radius: ['42%', '72%'], center: ['34%', '50%'], avoidLabelOverlap: true, itemStyle: { borderColor: '#0c151c1c', borderWidth: 3 }, label: { color: '#e8edf2', formatter: '{b}\n{d}%' }, data: messageShares.map(([name, value]) => ({ name, value, itemStyle: { color: getPlayerColor(name) } })) }] };
  const messageSharesOptionR20: ChartOption = { color: messageSharesR20.map(([name], index) => getPlayerColor(name, index)), tooltip: { trigger: 'item', confine: true, formatter: '{b}<br/>{c} messages ({d}%)' }, legend: { type: 'scroll', orient: 'vertical', right: 0, top: 'middle', textStyle: { color: '#94a4af' } }, series: [{ type: 'pie', radius: ['42%', '72%'], center: ['34%', '50%'], avoidLabelOverlap: true, itemStyle: { borderColor: '#0c151c1c', borderWidth: 3 }, label: { color: '#e8edf2', formatter: '{b}\n{d}%' }, data: messageSharesR20.map(([name, value]) => ({ name, value, itemStyle: { color: getPlayerColor(name) } })) }] };
  const allTimeOption: ChartOption = { ...wealthAxis, grid: { top: 48, right: 22, bottom: 58, left: 48, containLabel: true }, dataZoom: [{ type: 'slider', start: 0, end: 100, height: 18, bottom: 10 }, { type: 'inside', start: 0, end: 100 }], xAxis: { ...wealthAxis.xAxis, data: allTimeMessages.dates, axisLabel: { color: '#94a4af', rotate: 35, interval: 5 } }, yAxis: { ...wealthAxis.yAxis, name: 'Messages', nameTextStyle: { color: '#94a4af' } }, tooltip: { trigger: 'axis', confine: true }, series: [{ type: 'line', data: allTimeMessages.messages, smooth: true, symbol: 'none', lineStyle: { width: 3, color: '#f0a35b' }, areaStyle: { color: 'rgba(240, 163, 91, .12)' } }] };

  const charts = [
    ['Current player wealth', 'Approximate amount of GP currently held by each player.', wealthOption, 'wide'],
    ['Downs by player', 'Recorded downs in combat.', downsOption, 'wide'],
    ['Kills per adventure', 'Number of kills per adventure.', killsOption, 'wide'],
    ['Magic items over time', 'Unique non-craftable magic items collected per adventure.', magicOption, 'full'],
    ['HP per level', 'Health point total per player per level.', hpOption, 'full'],
    ['Discord messages per person', 'Share of Discord messages per person.', messageSharesOption, 'wide'],
    ['Roll20 messages per person', 'Share of messages in Roll20 per person.', messageSharesOptionR20, 'wide'],
    ['All-time Discord messages', 'Monthly discord activity from campaign start (May 2020) onward.', allTimeOption, 'full'],
  ] as const;

  return <section className="statistics-grid" aria-label="Campaign statistics">{charts.map(([title, subtitle, option, size]) => <article className={`statistics-card statistics-card-${size}`} key={title}><header><div><h2>{title}</h2><p>{subtitle}</p></div></header><StatisticsChart option={option} /></article>)}</section>;
}

const profilePictureFiles = import.meta.glob('./assets/dnd-pfps/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Assign a token filename to each sender as the player identities are confirmed.
const playerProfilePictures: Record<string, string> = {
  'Hypae\'Tia "Hype"': 'token_hypaetia',
  'Adrian of Ceylor': 'token_adrian',
  'AJ (DM)': 'token_dm',
  'Akta the Optimal': 'token_akta',
  'Algernon': 'token_algernon',
  'Denellon': 'token_denellon',
  'Imogen / Agnes': 'token_agnes',
  'Lyndon': 'token_lyndon',
  'Thalai': 'token_thalai',
  'Traymon "Tray"': 'token_tray',
};

function getProfilePicture(sender: string): string | undefined {
  const filename = playerProfilePictures[sender];
  if (!filename) return undefined;
  const normalizedFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
  return profilePictureFiles[`./assets/dnd-pfps/${normalizedFilename}`];
}

function renderMessageAuthor(sender: string): ReactNode {
  const profilePicture = getProfilePicture(sender);
  return <div className={`message-author${sender === 'AJ (DM)' ? ' dm-author' : ''}`}>
    {profilePicture && <img src={profilePicture} alt="" />}
    <h3>{sender}</h3>
  </div>;
}

function parseArchiveTimestamp(timestamp: string): Date {
  const parsedTimestamp = new Date(`${timestamp} GMT+0200`); // Currently does not account for Daylight savings time. I feel like it may be more trouble than it's worth.
  return Number.isNaN(parsedTimestamp.getTime()) ? new Date(timestamp) : parsedTimestamp;
}

function formatMessageTimestamp(timestamp: string): string {
  const date = parseArchiveTimestamp(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  const datePart = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date).replace(',', '');
  const timePart = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(date);
  return `${datePart}\n${timePart}`;
}

type RollResult = { total?: string | number };
type RollData = {
  formula?: string;
  result?: string | number;
  individual_rolls?: (string | number)[];
  dice_groups?: (string | number)[][];
  check_name?: string;
  results?: RollResult[];
};
type ChatMessage = {
  timestamp: string;
  sender: string;
  type: string;
  content: string | null;
  ability_name?: string;
  adventure?: string;
  roll_data?: RollData | null;
  raw_html?: string;
  ability_embed?: AbilityEmbed;
};

type AbilityRoll = {
  total?: string | number;
  individual_rolls?: (string | number)[];
  dice_groups?: (string | number)[][];
  modifiers?: { value?: string | number; label?: string }[];
  modifier?: string | number | null;
  formula?: string;
  type?: string;
  critical?: boolean;
};

type AbilityEmbed = {
  type?: string;
  name?: string;
  subtitle?: string;
  level?: number;
  casting_time?: string;
  range?: string;
  components?: string;
  duration?: string | null;
  description?: string | null;
  save_dc?: number | null;
  school?: string;
  rolls?: AbilityRoll[];
  modifier?: string | number | null;
  attacks?: AbilityRoll[];
  damage?: AbilityRoll[];
  attack_roll?: AbilityRoll | AbilityRoll[] | null;
  damage_roll?: AbilityRoll[];
  details?: Record<string, unknown>;
};

const messages = (ChatData as unknown as { messages: ChatMessage[] }).messages;
const pageSize = 100;
const scrollToTopOnPagination = true;
const miscAdventureNames: string[] = ["MergeMini", "NPCMini", "Citadel Puzl", "Challenge"];
const archiveSections = ['Chat Archive', 'Statistics', 'Live Map'];

function getAdventureCategory(adventure: string | undefined): string | undefined {
  const normalizedAdventure = adventure?.trim();
  if (!normalizedAdventure) return undefined;
  return miscAdventureNames.includes(normalizedAdventure) ? 'Misc' : normalizedAdventure;
}

function getRolls(message: ChatMessage): number[] {
  const rolls = message.roll_data?.results?.map((roll) => Number(roll.total)).filter(Number.isFinite) ?? [];
  if (rolls.length > 0) return rolls;
  const singleRoll = Number(message.roll_data?.result);
  return Number.isFinite(singleRoll) ? [singleRoll] : [];
}

function getSearchText(message: ChatMessage): string {
  const embed = message.ability_embed;
  const abilityRolls = [
    ...(embed?.rolls ?? []),
    ...getAbilityRolls(embed?.attacks, embed?.attack_roll),
    ...(embed?.damage ?? []),
    ...(embed?.damage_roll ?? []),
  ];
  const rollText = abilityRolls.flatMap((roll) => [
    roll.formula,
    roll.type,
    ...(roll.individual_rolls ?? []),
    ...(roll.dice_groups ?? []).flat(),
    ...(roll.modifiers ?? []).flatMap((modifier) => [modifier.label, modifier.value]),
  ]);
  return [
    message.content,
    message.ability_name,
    message.roll_data?.check_name,
    message.roll_data?.formula,
    message.roll_data?.result,
    embed?.name,
    embed?.subtitle,
    embed?.description,
    embed?.school,
    embed?.casting_time,
    embed?.range,
    embed?.components,
    embed?.duration,
    embed?.details && Object.values(embed.details),
    rollText,
  ]
    .filter(Boolean).join(' ');
}

function getDiceSides(formula: string): number[] {
  return [...formula.matchAll(/(?:^|[^\w])(?:(\d+))?d(\d+)/gi)].flatMap((match) => {
    const count = Number(match[1] || 1);
    return Array.from({ length: count }, () => Number(match[2]));
  });
}

function getNaturalClass(value: number, dieSides: number | undefined): string {
  return value === 1 ? 'natural-one' : value === dieSides ? 'natural-max' : '';
}

function renderDiceFace(value: number, dieSides: number | undefined, key: string): ReactNode {
  const supportsDiceFont = dieSides !== undefined && [2, 4, 6, 8, 10, 12, 20].includes(dieSides) &&
    value >= (dieSides === 10 ? 0 : 1) && value <= dieSides;
  const naturalClass = getNaturalClass(value, dieSides);

  if (!supportsDiceFont) return <span className={naturalClass} key={key}>{value}</span>;

  return <i
    aria-label={`d${dieSides} rolled ${value}`}
    className={`dice-glyph df-d${dieSides}-${value} ${naturalClass}`}
    key={key}
    role="img"
  />;
}

function cleanEmbedText(value: string): string {
  return value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function getEmbedDescription(message: ChatMessage): string {
  if (message.ability_embed?.description) return cleanEmbedText(message.ability_embed.description);
  const descriptionMatch = message.raw_html?.match(/sheet-description">([\s\S]*?)<\/span>\s*<\/div>/i);
  return descriptionMatch ? cleanEmbedText(descriptionMatch[1]) : '';
}

function formatDuration(duration: string | null | undefined): string {
  if (!duration) return '';
  const normalized = duration.replace(/\s+/g, ' ').trim();
  if (/concentration/i.test(normalized)) {
    const cleaned = normalized.replace(/\bconcentration\b/gi, ' ').replace(/[\s,;:]+/g, ' ').trim();
    return cleaned ? `${cleaned} (Concentration)` : 'Concentration';
  }
  return normalized;
}

function renderAbilityRoll(roll: AbilityRoll, label: string, index: number): ReactNode {
  const total = roll.total ?? '—';
  const individualRolls = Array.isArray(roll.individual_rolls) ? roll.individual_rolls.map((item) => Number(item)).filter(Number.isFinite) : [];
  const formula = typeof roll.formula === 'string' ? roll.formula.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  const dieSides = formula ? getDiceSides(formula) : [];
  const detailParts: ReactNode[] = [];

  individualRolls.forEach((value, rollIndex) => {
    if (detailParts.length > 0) detailParts.push(' + ');
    detailParts.push(renderDiceFace(value, dieSides[rollIndex], `${label}-die-${index}-${rollIndex}`));
  });

  const modifiers = (roll.modifiers ?? []).filter((modifier) => modifier.value != null && modifier.value !== '');
  const modifierValue = modifiers.length > 0 || roll.modifier == null || roll.modifier === '' ? null : Number(roll.modifier);
  [...modifiers.map((modifier) => `${modifier.label ? `${modifier.label}: ` : ''}${modifier.value}`), modifierValue === null ? null : String(modifierValue)]
    .filter((modifier): modifier is string => modifier !== null)
    .forEach((modifier) => {
    if (detailParts.length > 0) detailParts.push(' + ');
      detailParts.push(modifier);
    });

  return <div className="ability-roll" key={`${label}-${index}-${String(total)}`}>
    <span className="ability-roll-label">{label}</span>
    <strong>{total}</strong>
    {detailParts.length > 0 && <span className="ability-roll-detail">{detailParts}</span>}
    {roll.type && <span className="ability-roll-type">{roll.type}</span>}
    {formula && <span className="ability-roll-formula">{formula}</span>}
  </div>;
}

function getAbilityRolls(primaryRolls: AbilityRoll[] | undefined, fallbackRolls: AbilityRoll | AbilityRoll[] | null | undefined): AbilityRoll[] {
  if (primaryRolls && primaryRolls.length > 0) return primaryRolls;
  if (!fallbackRolls) return [];
  return Array.isArray(fallbackRolls) ? fallbackRolls : [fallbackRolls];
}

function renderAbilityEmbed(message: ChatMessage): ReactNode {
  const embed = message.ability_embed;
  if (!embed) return null;
  const description = getEmbedDescription(message);
  const skillRolls = embed.rolls && embed.rolls.length > 0 ? embed.rolls : [];
  const attackRolls = getAbilityRolls(embed.attacks, embed.attack_roll);
  const damageRolls = embed.damage && embed.damage.length > 0 ? embed.damage : embed.damage_roll ?? [];
  const shouldShowUnnamedAbility = !embed.name && attackRolls.length === 0 && !(skillRolls.length > 0) && !(damageRolls.length > 0 && !attackRolls.length);
  const details = [
    ['Casting time', embed.casting_time],
    ['Range', embed.range],
    ['Components', embed.components?.replace(/\s+/g, ' ').trim()],
    ['Duration', formatDuration(embed.duration)],
    ['Save DC', embed.save_dc == null ? '' : String(embed.save_dc)],
    ['Target', embed.details && typeof embed.details.target === 'string' ? String(embed.details.target) : ''],
  ].filter(([, value]) => value);

  return <div className="ability-card">
    <div className="ability-card-heading">
      <div className="ability-card-title">
        <span className="ability-kind">{embed.type || 'ability'}</span>
        {embed.name ? <span className="ability-name">{embed.name}</span> : shouldShowUnnamedAbility && <span className="ability-name">Unnamed ability</span>}
        {embed.subtitle && <span className="ability-subtitle">{embed.subtitle}</span>}
      </div>
      {(embed.school || embed.level != null) && <span className="ability-level">{[embed.school, embed.level != null ? `Level ${embed.level}` : ''].filter(Boolean).join(' / ')}</span>}
    </div>
    <dl className="ability-details">{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {skillRolls.length > 0 && <div className="ability-rolls">{skillRolls.map((roll, index) => renderAbilityRoll(roll, skillRolls.length > 1 ? `Roll ${index + 1}` : 'Roll', index))}</div>}
    {attackRolls.length > 0 && <div className="ability-rolls">{attackRolls.map((roll, index) => renderAbilityRoll(roll, attackRolls.length > 1 ? `Attack ${index + 1}` : 'Attack', index))}</div>}
    {damageRolls.length > 0 && <div className="ability-rolls">{damageRolls.map((roll, index) => renderAbilityRoll(roll, damageRolls.length > 1 ? `Damage ${index + 1}` : 'Damage', index))}</div>}
    {description && <p className="ability-description">{description}</p>}
  </div>;
}

function renderSpecifiedFormula(formula: string): ReactNode[] {
  const diceSides = getDiceSides(formula);
  const diePattern = /(\()?<span class="basicdiceroll(?: [^"]*)?">(-?\d+)<\/span>(\)?)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let dieIndex = 0;
  let match = diePattern.exec(formula);

  while (match) {
    const precedingText = formula.slice(lastIndex, match.index).replace(/<[^>]+>/g, '');
    if (precedingText) parts.push(precedingText);

    const value = Number(match[2]);
    const dieSidesValue = diceSides[dieIndex];
    parts.push(renderDiceFace(value, dieSidesValue, `${match.index}-${dieIndex}`));
    lastIndex = match.index + match[0].length;
    dieIndex += 1;
    match = diePattern.exec(formula);
  }

  const remainingText = formula.slice(lastIndex).replace(/<[^>]+>/g, '');
  if (remainingText) parts.push(remainingText);
  return parts;
}

function renderGeneralFormula(formula: string, individualRolls: (string | number)[], diceGroups: (string | number)[][] = []): ReactNode[] {
  const formulaText = formula.replace(/^rolling\s+/i, '').split('=')[0].trim();
  const expressionMatch = formulaText.match(/^((?:[+-]?\s*\d*d\d+|[+-]\s*\d+(?:\.\d+)?)(?:\s*[+-]\s*(?:\d*d\d+|\d+(?:\.\d+)?))*)(?:\s+(.*))?$/i);
  const expression = expressionMatch?.[1] || formulaText;
  const expressionLabel = expressionMatch?.[2] || '';
  const diceSides = getDiceSides(expression);
  const termPattern = /([+-]?\s*\d*d\d+|[+-]\s*\d+(?:\.\d+)?)/gi;
  const renderExpression = (showIndividualRolls: boolean): ReactNode[] => {
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let dieIndex = 0;
    let groupIndex = 0;
    let match = termPattern.exec(expression);

    while (match) {
      const precedingText = expression.slice(lastIndex, match.index);
      if (precedingText) parts.push(showIndividualRolls ? precedingText.replace(/\s/g, '') : precedingText);

      if (showIndividualRolls && /d/i.test(match[0])) {
        const diceCount = Number(match[0].split('d')[0]) || 1;
        const groupRolls = diceGroups[groupIndex] ?? individualRolls.slice(dieIndex, dieIndex + diceCount);
        const termSides = getDiceSides(match[0]);
        const operator = match[0].match(/^[+-]/)?.[0];
        if (operator) parts.push(operator);
        for (let rollIndex = 0; rollIndex < groupRolls.length; rollIndex += 1) {
          const roll = groupRolls[rollIndex];
          if (roll !== undefined) {
            const value = Number(roll);
            parts.push(renderDiceFace(value, termSides[rollIndex] ?? diceSides[dieIndex], `${match.index}-${dieIndex}`));
            dieIndex += 1;
            if (rollIndex < groupRolls.length - 1) parts.push('+');
          }
        }
        groupIndex += 1;
      } else {
        parts.push(showIndividualRolls ? match[0].replace(/\s/g, '') : match[0]);
      }

      lastIndex = match.index + match[0].length;
      match = termPattern.exec(expression);
    }

    const remainingText = expression.slice(lastIndex);
    if (remainingText) parts.push(showIndividualRolls ? remainingText.replace(/\s/g, '') : remainingText);
    return parts;
  };

  return ['Rolling ', renderExpression(false), expressionLabel ? ` ${expressionLabel}` : '', ' = ', renderExpression(true)];
}

function getMessageTypeLabel(type: string): string {
  return type === 'general' ? 'message' : type.replace('_', ' ');
}

function isRollMessage(message: ChatMessage): boolean {
  return message.type === 'roll' || message.type === 'specified_roll';
}

function DnDPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [sectionDirection, setSectionDirection] = useState<-1 | 1>(1);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [adventure, setAdventure] = useState('');
  const [minRoll, setMinRoll] = useState('');
  const [maxRoll, setMaxRoll] = useState('');
  const [page, setPage] = useState(0);

  const users = useMemo(() => [...new Set(messages.map((message) => message.sender))].sort(), []);
  const adventures = useMemo(() => {
    const adventuresInChronologicalOrder = messages
      .map((message, index) => ({
        adventure: getAdventureCategory(message.adventure),
        date: parseArchiveTimestamp(message.timestamp).getTime(),
        index,
      }))
      .filter((item): item is { adventure: string; date: number; index: number } => Boolean(item.adventure))
      .sort((left, right) => {
        if (Number.isNaN(left.date) && Number.isNaN(right.date)) return left.index - right.index;
        if (Number.isNaN(left.date)) return 1;
        if (Number.isNaN(right.date)) return -1;
        return left.date - right.date || left.index - right.index;
      });

    const uniqueAdventures = [...new Set(adventuresInChronologicalOrder.map((item) => item.adventure))];
    return [...uniqueAdventures.filter((item) => item !== 'Misc'), ...uniqueAdventures.filter((item) => item === 'Misc')];
  }, []);
  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minimum = minRoll === '' ? undefined : Number(minRoll);
    const maximum = maxRoll === '' ? undefined : Number(maxRoll);
    return messages.filter((message) => {
      const parsedDate = parseArchiveTimestamp(message.timestamp);
      const messageDay = Number.isNaN(parsedDate.getTime()) ? '' : [parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate()]
        .map((part) => String(part).padStart(2, '0')).join('-');
      const rolls = getRolls(message);
      return (!query || getSearchText(message).toLowerCase().includes(query)) &&
        (!startDate || messageDay >= startDate) && (!endDate || messageDay <= endDate) &&
        (selectedUsers.length === 0 || selectedUsers.includes(message.sender)) &&
        (!adventure || getAdventureCategory(message.adventure) === adventure) &&
        (minimum === undefined || rolls.some((roll) => roll >= minimum)) &&
        (maximum === undefined || rolls.some((roll) => roll <= maximum));
    });
  }, [adventure, endDate, maxRoll, minRoll, search, selectedUsers, startDate]);

  const pageCount = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleMessages = filteredMessages.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    if (scrollToTopOnPagination) window.scrollTo(0, 0);
  };
  const updateFilter = (update: () => void) => { update(); setPage(0); };
  const toggleUser = (user: string) => updateFilter(() => setSelectedUsers((current) => current.includes(user) ? current.filter((item) => item !== user) : [...current, user]));
  const resetFilters = () => {
    setSearch(''); setStartDate(''); setEndDate(''); setSelectedUsers([]);
    setAdventure(''); setMinRoll(''); setMaxRoll(''); setPage(0);
  };
  const changeSection = (direction: number) => {
    setSectionDirection(direction < 0 ? -1 : 1);
    setActiveSection((current) => (current + direction + archiveSections.length) % archiveSections.length);
  };
  const previousSection = archiveSections[(activeSection - 1 + archiveSections.length) % archiveSections.length];
  const nextSection = archiveSections[(activeSection + 1) % archiveSections.length];

  return (
    <main className="dnd-page">
      <nav className="section-switcher" aria-label="D&D hub sections">
        <span className="section-neighbor section-neighbor-left">{previousSection}</span>
        <button type="button" className="section-arrow" onClick={() => changeSection(-1)} aria-label={`Show ${previousSection}`}><img src={leftArrowIcon} alt="" aria-hidden="true" /></button>
        <strong className={`section-current section-current-${sectionDirection < 0 ? 'left' : 'right'}`} key={activeSection}>{archiveSections[activeSection]}</strong>
        <button type="button" className="section-arrow" onClick={() => changeSection(1)} aria-label={`Show ${nextSection}`}><img src={rightArrowIcon} alt="" aria-hidden="true" /></button>
        <span className="section-neighbor section-neighbor-right">{nextSection}</span>
      </nav>
      {archiveSections[activeSection] === 'Chat Archive' ? (
        <>
          <section className="dnd-heading">
            <p className="eyebrow">DND HUB / CHAT ARCHIVE</p>
            <h1>Campaign chat archive</h1>
            <p>Search the messages, rolls, and moments across the complete Roll20 chat archive.</p>
          </section>
          <section className="dnd-layout" aria-label="Chat archive explorer">
          <aside className="dnd-filters">
            <div className="filter-heading"><h2>Filter archive</h2><button type="button" className="text-button" onClick={resetFilters}>Reset</button></div>
            <label className="filter-field search-field"><span>Search text, ability, or formula</span><input value={search} onChange={(event) => updateFilter(() => setSearch(event.target.value))} placeholder="Try: perception, heal..." /></label>
            <fieldset><legend>Date range</legend><div className="date-grid">
              <label className="filter-field"><span>From</span><input type="date" value={startDate} onChange={(event) => updateFilter(() => setStartDate(event.target.value))} /></label>
              <label className="filter-field"><span>To</span><input type="date" value={endDate} onChange={(event) => updateFilter(() => setEndDate(event.target.value))} /></label>
            </div></fieldset>
            <fieldset><legend>Roll result</legend><div className="date-grid">
              <label className="filter-field"><span>At least</span><input type="number" value={minRoll} onChange={(event) => updateFilter(() => setMinRoll(event.target.value))} placeholder="0" /></label>
              <label className="filter-field"><span>At most</span><input type="number" value={maxRoll} onChange={(event) => updateFilter(() => setMaxRoll(event.target.value))} placeholder="20" /></label>
            </div></fieldset>
            <label className="filter-field"><span>Adventure</span><select value={adventure} onChange={(event) => updateFilter(() => setAdventure(event.target.value))}><option value="">All adventures</option>{adventures.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <fieldset className="user-filter"><legend>Players ({selectedUsers.length || 'all'})</legend><div className="user-list">{users.map((user) => <label key={user} className="user-option"><input type="checkbox" checked={selectedUsers.includes(user)} onChange={() => toggleUser(user)} /><span>{user}</span></label>)}</div></fieldset>
          </aside>
          <section className="dnd-results">
            <div className="results-toolbar"><div><strong>{filteredMessages.length.toLocaleString()}</strong> matching messages <span className="muted">/ {messages.length.toLocaleString()} total</span></div><div className="page-navigation"><span className="page-status">Page {currentPage + 1} of {pageCount}</span><div className="pagination pagination-top"><button type="button" onClick={() => changePage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>Previous</button><button type="button" onClick={() => changePage(Math.min(pageCount - 1, currentPage + 1))} disabled={currentPage >= pageCount - 1}>Next</button></div></div></div>
            <div className="message-list">{visibleMessages.map((message, index) => <article className="chat-message" key={`${message.timestamp}-${message.sender}-${currentPage}-${index}`}>
              <div className="message-meta"><time dateTime={parseArchiveTimestamp(message.timestamp).toISOString()}>{formatMessageTimestamp(message.timestamp)}</time>{getAdventureCategory(message.adventure) !== 'Misc' && getAdventureCategory(message.adventure) && <span className="message-adventure">{getAdventureCategory(message.adventure)}</span>}<span className="message-type">{getMessageTypeLabel(message.type)}</span></div>
              <div className={`message-body${message.ability_embed ? ' has-ability-embed' : ''}`}>{message.ability_embed ? <><div className="ability-message-header">{renderMessageAuthor(message.sender)}</div>{renderAbilityEmbed(message)}</> : <>{renderMessageAuthor(message.sender)}{message.roll_data?.check_name && <span className="ability">{message.roll_data.check_name}</span>}<p>{message.content || (message.type === 'specified_roll' && message.roll_data?.formula ? renderSpecifiedFormula(message.roll_data.formula) : message.type === 'roll' && message.roll_data?.formula && message.roll_data.individual_rolls ? renderGeneralFormula(message.roll_data.formula, message.roll_data.individual_rolls, message.roll_data.dice_groups) : message.roll_data?.formula?.replace(/<[^>]+>/g, '')) || 'Roll recorded without accompanying text.'}</p></>}</div>
              {isRollMessage(message) && <div className="roll-value"><span>RESULT</span><strong>{getRolls(message).join(' / ') || 'No result'}</strong></div>}
            </article>)}{visibleMessages.length === 0 && <div className="empty-state"><strong>No messages found</strong><span>Try widening your filters or clearing the search.</span></div>}</div>
            <div className="pagination"><button type="button" onClick={() => changePage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>Previous</button><button type="button" onClick={() => changePage(Math.min(pageCount - 1, currentPage + 1))} disabled={currentPage >= pageCount - 1}>Next</button></div>
          </section>
          </section>
        </>
      ) : archiveSections[activeSection] === 'Statistics' ? (
        <>
          <section className="dnd-heading">
            <p className="eyebrow">DND HUB / STATISTICS</p>
            <h1>Campaign Statistics</h1>
            <p>View various statistics about players and the campaign.</p>
          </section>
          <StatisticsDashboard />
        </>
      ) : (
        <>
          <section className="dnd-heading">
            <p className="eyebrow">DND HUB / LIVE MAP</p>
            <h1>Live Campaign Map [WIP]</h1>
            <p>View a live and historic travel log of the players' many adventures.</p>
          </section>
          {
          <div className="landscape-page">
            <div className="viewer-wrapper">
              <LandscapeViewer 
                modelPath="models/landscape.glb"
                minZoom={5}
                maxZoom={25}
              />
            </div>
          </div>
          }
        </>
      )}
    </main>
  );
}

export default DnDPage
