import React, {useState, useContext} from 'react'
import classNames from 'classnames';
import {MenuContext} from './menu';
import {MenuItemProps} from './menuItem';
import Icon from "../icon/icon";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";

export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
}

const SubMenu: React.FC<SubMenuProps> = (props) => {
  const {index, title, children, className} = props;
  const context = useContext(MenuContext);
  const isOpen: boolean = index && context.mode === 'vertical'
    && context.defaultOpenSubs.includes(index);

  const [menuOpen, setMenuOpen] = useState(isOpen);

  const handleClick = (e) => {
    e.preventDefault();
    setMenuOpen(!menuOpen);
  }

  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setMenuOpen(toggle);
    }, 250);
  }

  const clickEvents = context.mode === 'vertical' ? {
    onClick: handleClick
  } : {};
  const hoverEvents = context.mode !== 'vertical' ? {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouse(e, true)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouse(e, false)
    }
  } : {};

  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.activeIndex === index
  });

  const childrenComponent = React.Children.map(children, (child, i) => {
    const childElement = child as React.FunctionComponentElement<MenuItemProps>;
    if (childElement.type.displayName === 'MenuItem') {
      return React.cloneElement(childElement, {
        index: `${index}-${i}`
      });
    }
    console.error("Warning: Menu has a child whitch is not a MenuItem Component");
    return null;
  });
  const subMenuClasses = classNames('viking-submenu', {
    'menu-opened': menuOpen
  });

  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className="submenu-title" {...clickEvents}>
        {title}
        <Icon icon={faAngleDown} className="arrow-icon"/>
      </div>
      <ul className={subMenuClasses}>
        {childrenComponent}
      </ul>
    </li>
  )
}

SubMenu.displayName = "MenuItem";
export default SubMenu