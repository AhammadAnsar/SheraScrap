import React from 'react';
import { areaGroups, areaPath, serviceAreas, featuredAreaSlugs, type Lang } from '../content/serviceAreas';
export default function ServiceAreaGrid({lang, featured = false}: {lang:Lang; featured?:boolean}) {
  const groups = featured ? [serviceAreas.filter(a=>featuredAreaSlugs.includes(a.slug)),serviceAreas.filter(a=>!featuredAreaSlugs.includes(a.slug))] : areaGroups.map((_,i)=>serviceAreas.filter(a=>a.group===i));
  return <div className="area-groups">{groups.map((areas,i)=><div key={i}>
    {!featured && <h2>{areaGroups[i][lang]}</h2>}
    <ul className={`area-grid ${featured && i===0 ? 'area-featured' : ''}`}>{areas.map(a=><li key={a.slug}><a href={areaPath(a,lang)}><span>{a.name[lang]}</span><span aria-hidden="true">{lang==='ar'?'←':'↗'}</span></a></li>)}</ul>
  </div>)}</div>;
}
