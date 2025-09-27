import { ChevronRight, File, Folder, FolderOpen, Link } from 'lucide-react'
import * as React from 'react'
import { cn, getFavicon } from '@/lib/utils'

interface TreeNode {
  id: string
  title: string
  url?: string
  children?: TreeNode[]
  icon?: React.ReactNode
}

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeNode[]
  onNodeClick?: (node: TreeNode) => void
  onNodeExpand?: (node: TreeNode) => void
  onNodeCollapse?: (node: TreeNode) => void
  defaultExpanded?: string[]
  expanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
}

interface TreeNodeProps {
  node: TreeNode
  level: number
  isExpanded: boolean
  onToggle: (nodeId: string) => void
  onNodeClick?: (node: TreeNode) => void
  onNodeExpand?: (node: TreeNode) => void
  onNodeCollapse?: (node: TreeNode) => void
  expanded: string[]
}

function TreeNodeComponent({ ref, node, level, isExpanded, onToggle, onNodeClick, onNodeExpand, onNodeCollapse, expanded }: TreeNodeProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const hasChildren = node.children && node.children.length > 0
  const isLeaf = !hasChildren

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
      onToggle(node.id)
      if (isExpanded && onNodeCollapse) {
        onNodeCollapse(node)
      }
      else if (!isExpanded && onNodeExpand) {
        onNodeExpand(node)
      }
    }
    if (onNodeClick) {
      onNodeClick(node)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e as any)
    }
  }

  const getIcon = () => {
    if (node.icon)
      return node.icon
    if (isLeaf) {
      return node.url ? <img src={getFavicon(node.url)} className="h-4 w-4" /> : <File className="h-4 w-4" />
    }
    return isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
  }

  return (
    <div ref={ref}>
      <div
        className={cn(
          'flex items-center gap-1 py-1 px-2 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer select-none',
          'focus:outline-none focus:ring-1 focus:ring-ring',
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="treeitem"
        aria-expanded={isExpanded}
        aria-selected={false}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 transition-transform',
              isExpanded && 'rotate-90',
            )}
          />
        )}
        {!hasChildren && <div className="w-4" />}
        {getIcon()}
        <span className="flex-1 text-sm truncate">{node.title}</span>
      </div>
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map(child => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={expanded.includes(child.id)}
              onToggle={onToggle}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              onNodeCollapse={onNodeCollapse}
              expanded={expanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
TreeNodeComponent.displayName = 'TreeNodeComponent'

export function Tree({ ref, data, onNodeClick, onNodeExpand, onNodeCollapse, defaultExpanded = [], expanded: controlledExpanded, onExpandedChange, className, ...props }: TreeProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const [internalExpanded, setInternalExpanded] = React.useState<string[]>(defaultExpanded)
  const expanded = controlledExpanded ?? internalExpanded
  const isControlled = controlledExpanded !== undefined

  const handleToggle = (nodeId: string) => {
    const newExpanded = expanded.includes(nodeId)
      ? expanded.filter(id => id !== nodeId)
      : [...expanded, nodeId]

    if (isControlled) {
      onExpandedChange?.(newExpanded)
    }
    else {
      setInternalExpanded(newExpanded)
    }
  }

  const handleNodeClick = (node: TreeNode) => {
    onNodeClick?.(node)
  }

  return (
    <div
      ref={ref}
      className={cn('space-y-1', className)}
      role="tree"
      {...props}
    >
      {data.map(node => (
        <div key={node.id} className="group">
          <TreeNodeComponent
            node={node}
            level={0}
            isExpanded={expanded.includes(node.id)}
            onToggle={handleToggle}
            onNodeClick={handleNodeClick}
            onNodeExpand={onNodeExpand}
            onNodeCollapse={onNodeCollapse}
            expanded={expanded}
          />
        </div>
      ))}
    </div>
  )
}
Tree.displayName = 'Tree'
