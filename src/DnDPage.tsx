import { useMemo, useState, type ReactNode } from 'react';
import ChatData from './assets/chatdata.json';
import './DnDPage.css';

type RollResult = { total?: string | number };
type RollData = {
  formula?: string;
  result?: string | number;
  individual_rolls?: (string | number)[];
  check_name?: string;
  results?: RollResult[];
};
type ChatMessage = {
  timestamp: string;
  sender: string;
  type: string;
  content: string | null;
  adventure?: string;
  roll_data?: RollData | null;
  raw_html?: string;
  ability_embed?: AbilityEmbed;
};

type AbilityRoll = {
  total?: string | number;
  individual_rolls?: (string | number)[];
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
  attack_roll?: AbilityRoll | null;
  damage_roll?: AbilityRoll[];
  details?: Record<string, unknown>;
};

const messages = (ChatData as unknown as { messages: ChatMessage[] }).messages;
const pageSize = 100;
const scrollToTopOnPagination = true;

function getRolls(message: ChatMessage): number[] {
  const rolls = message.roll_data?.results?.map((roll) => Number(roll.total)).filter(Number.isFinite) ?? [];
  if (rolls.length > 0) return rolls;
  const singleRoll = Number(message.roll_data?.result);
  return Number.isFinite(singleRoll) ? [singleRoll] : [];
}

function getSearchText(message: ChatMessage): string {
  return [message.content, message.roll_data?.check_name, message.roll_data?.formula, message.roll_data?.result]
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
    const cleaned = normalized.replace(/\bconcentration\b/gi, '').replace(/[\s,;:]+/g, ' ').trim();
    return cleaned ? `${cleaned} (Concentration)` : 'Concentration';
  }
  return normalized;
}

function renderAbilityRoll(roll: AbilityRoll, label: string, index: number): ReactNode {
  const total = roll.total ?? '—';
  const modifierValue = roll.modifier == null || roll.modifier === '' ? null : Number(roll.modifier);
  const individualRolls = Array.isArray(roll.individual_rolls) ? roll.individual_rolls.map((item) => Number(item)).filter(Number.isFinite) : [];
  const formula = typeof roll.formula === 'string' ? roll.formula.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  const dieSides = formula ? getDiceSides(formula) : [];
  const detailParts: ReactNode[] = [];

  individualRolls.forEach((value, rollIndex) => {
    if (detailParts.length > 0) detailParts.push(' + ');
    const className = getNaturalClass(value, dieSides[rollIndex]);
    detailParts.push(<span key={`${label}-die-${index}-${rollIndex}`} className={className}>({value})</span>);
  });

  if (modifierValue !== null) {
    if (detailParts.length > 0) detailParts.push(' + ');
    detailParts.push(String(modifierValue));
  }

  return <div className="ability-roll" key={`${label}-${index}-${String(total)}`}>
    <span className="ability-roll-label">{label}</span>
    <strong>{total}</strong>
    {detailParts.length > 0 && <span className="ability-roll-detail">{detailParts}</span>}
    {roll.type && <span className="ability-roll-type">{roll.type}</span>}
    {formula && <span className="ability-roll-formula">{formula}</span>}
  </div>;
}

function renderAbilityEmbed(message: ChatMessage): ReactNode {
  const embed = message.ability_embed;
  if (!embed) return null;
  const description = getEmbedDescription(message);
  const skillRolls = embed.rolls && embed.rolls.length > 0 ? embed.rolls : [];
  const attackRolls = embed.attacks && embed.attacks.length > 0 ? embed.attacks : embed.attack_roll ? [embed.attack_roll] : [];
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
    const className = getNaturalClass(value, dieSidesValue);
    parts.push(<span className={className} key={`${match.index}-${dieIndex}`}>{match[1] || ''}{match[2]}{match[3] || ''}</span>);
    lastIndex = match.index + match[0].length;
    dieIndex += 1;
    match = diePattern.exec(formula);
  }

  const remainingText = formula.slice(lastIndex).replace(/<[^>]+>/g, '');
  if (remainingText) parts.push(remainingText);
  return parts;
}

function renderGeneralFormula(formula: string, individualRolls: (string | number)[]): ReactNode[] {
  const expression = formula.replace(/^rolling\s+/i, '').split('=')[0].trim();
  const diceSides = getDiceSides(expression);
  const termPattern = /(\d*d\d+|[+-]\s*\d+(?:\.\d+)?)/gi;
  const renderExpression = (showIndividualRolls: boolean): ReactNode[] => {
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let dieIndex = 0;
    let match = termPattern.exec(expression);

    while (match) {
      const precedingText = expression.slice(lastIndex, match.index);
      if (precedingText) parts.push(showIndividualRolls ? precedingText.replace(/\s/g, '') : precedingText);

      if (showIndividualRolls && /d/i.test(match[0])) {
        const diceCount = Number(match[0].split('d')[0]) || 1;
        for (let rollIndex = 0; rollIndex < diceCount; rollIndex += 1) {
          const roll = individualRolls[dieIndex];
          if (roll !== undefined) {
            const value = Number(roll);
            parts.push(<span key={`${match.index}-${dieIndex}`} className={getNaturalClass(value, diceSides[dieIndex])}>({roll})</span>);
            dieIndex += 1;
            if (rollIndex < diceCount - 1) parts.push('+');
          }
        }
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

  return ['Rolling ', renderExpression(false), ' = ', renderExpression(true)];
}

function getMessageTypeLabel(type: string): string {
  return type === 'general' ? 'message' : type.replace('_', ' ');
}

function isRollMessage(message: ChatMessage): boolean {
  return message.type === 'roll' || message.type === 'specified_roll';
}

function DnDPage() {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [adventure, setAdventure] = useState('');
  const [minRoll, setMinRoll] = useState('');
  const [maxRoll, setMaxRoll] = useState('');
  const [page, setPage] = useState(0);

  const users = useMemo(() => [...new Set(messages.map((message) => message.sender))].sort(), []);
  const adventures = useMemo(() => [...new Set(messages.map((message) => message.adventure?.trim()).filter(Boolean) as string[])].sort(), []);
  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minimum = minRoll === '' ? undefined : Number(minRoll);
    const maximum = maxRoll === '' ? undefined : Number(maxRoll);
    return messages.filter((message) => {
      const parsedDate = new Date(message.timestamp);
      const messageDay = Number.isNaN(parsedDate.getTime()) ? '' : [parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate()]
        .map((part) => String(part).padStart(2, '0')).join('-');
      const rolls = getRolls(message);
      return (!query || getSearchText(message).toLowerCase().includes(query)) &&
        (!startDate || messageDay >= startDate) && (!endDate || messageDay <= endDate) &&
        (selectedUsers.length === 0 || selectedUsers.includes(message.sender)) &&
        (!adventure || message.adventure?.trim() === adventure) &&
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

  return (
    <main className="dnd-page">
      <section className="dnd-heading">
        <p className="eyebrow">ARCHIVE / DND HUB</p>
        <h1>Campaign chat archive</h1>
        <p>Search the table talk, rolls, and moments across the complete chat archive.</p>
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
          <div className="results-toolbar"><div><strong>{filteredMessages.length.toLocaleString()}</strong> matching messages <span className="muted">/ {messages.length.toLocaleString()} total</span></div><span className="page-status">Page {currentPage + 1} of {pageCount}</span></div>
          <div className="message-list">{visibleMessages.map((message, index) => <article className="chat-message" key={`${message.timestamp}-${message.sender}-${currentPage}-${index}`}>
            <div className="message-meta"><time>{message.timestamp}</time><span className="message-type">{getMessageTypeLabel(message.type)}</span></div>
            <div className={`message-body${message.ability_embed ? ' has-ability-embed' : ''}`}>{message.ability_embed ? <><div className="ability-message-header"><h3>{message.sender}</h3></div>{renderAbilityEmbed(message)}</> : <><h3>{message.sender}</h3>{message.roll_data?.check_name && <span className="ability">{message.roll_data.check_name}</span>}<p>{message.content || (message.type === 'specified_roll' && message.roll_data?.formula ? renderSpecifiedFormula(message.roll_data.formula) : message.type === 'roll' && message.roll_data?.formula && message.roll_data.individual_rolls ? renderGeneralFormula(message.roll_data.formula, message.roll_data.individual_rolls) : message.roll_data?.formula?.replace(/<[^>]+>/g, '')) || 'Roll recorded without accompanying text.'}</p></>}</div>
            {isRollMessage(message) && <div className="roll-value"><span>RESULT</span><strong>{getRolls(message).join(' / ') || 'No result'}</strong></div>}
          </article>)}{visibleMessages.length === 0 && <div className="empty-state"><strong>No messages found</strong><span>Try widening your filters or clearing the search.</span></div>}</div>
          <div className="pagination"><button type="button" onClick={() => changePage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>Previous</button><button type="button" onClick={() => changePage(Math.min(pageCount - 1, currentPage + 1))} disabled={currentPage >= pageCount - 1}>Next</button></div>
        </section>
      </section>
    </main>
  );
}

export default DnDPage
