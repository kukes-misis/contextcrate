import type { SourceFile } from './lib/engine';
export const demoGoal = 'Add a search filter to the project list. Match project names without case sensitivity and show a useful empty state.';
export const demoCriteria = 'Keep the current sorting. Add tests for case-insensitive matches and no results. Make the search input accessible.';
export const demoFiles: SourceFile[] = [
{path:'README.md',content:'# Orbit\nA small project dashboard built with React and TypeScript.\nRun npm test for unit checks.\n'},
{path:'src/App.tsx',content:"import { ProjectList } from './components/ProjectList';\nimport { projects } from './data/projects';\n\nexport function App() {\n  return <main><h1>Your projects</h1><ProjectList projects={projects} /></main>;\n}\n"},
{path:'src/components/ProjectList.tsx',content:"import { sortProjects, type Project } from '../lib/projects';\n\nexport function ProjectList({ projects }: { projects: Project[] }) {\n  const sorted = sortProjects(projects);\n  return <ul>{sorted.map(project => <li key={project.id}>\n    <a href={project.url}>{project.name}</a>\n    <span>{project.status}</span>\n  </li>)}</ul>;\n}\n"},
{path:'src/lib/projects.ts',content:"export interface Project { id: string; name: string; url: string; status: 'active' | 'archived' }\n\nexport function sortProjects(projects: Project[]): Project[] {\n  return [...projects].sort((a, b) => a.name.localeCompare(b.name));\n}\n"},
{path:'src/lib/projects.test.ts',content:"import { expect, it } from 'vitest';\nimport { sortProjects } from './projects';\n\nit('sorts projects by name without changing the input', () => {\n  const projects = [{ id: '2', name: 'Zen', url: '/', status: 'active' as const },\n    { id: '1', name: 'Atlas', url: '/', status: 'active' as const }];\n  expect(sortProjects(projects)[0].name).toBe('Atlas');\n  expect(projects[0].name).toBe('Zen');\n});\n"},
{path:'src/data/projects.ts',content:"export const projects = [\n  { id: 'atlas', name: 'Atlas', url: '/atlas', status: 'active' as const },\n  { id: 'orbit', name: 'Orbit', url: '/orbit', status: 'active' as const },\n];\n"},
{path:'src/styles.css',content:':root { font-family: system-ui; color: #172543; }\nmain { max-width: 900px; margin: 60px auto; }\nli { display: flex; justify-content: space-between; padding: 16px; }\n'},
{path:'package.json',content:'{"name":"orbit-demo","scripts":{"test":"vitest run"},"dependencies":{"react":"^19.0.0"},"devDependencies":{"vitest":"^3.0.0"}}'},
{path:'.env.example',content:'DEMO_VALUE=placeholder'},
{path:'dist/app.min.js',content:'/* Example generated output. Excluded from context. */'},
{path:'package-lock.json',content:'{"lockfileVersion":3}'},
];
