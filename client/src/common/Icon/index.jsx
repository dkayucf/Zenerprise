/* eslint-disable react/prop-types */
import * as React from 'react'
import { SvgIcon } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import WarehouseIcon from '../../assets/icons/warehouse.svg'
import BarcodeScanner from '../../assets/icons/barcodeScanner.svg'
import InventoryReports from '../../assets/icons/inventoryReports.svg'
import InventoryList from '../../assets/icons/inventoryList.svg'
import OrderGuide from '../../assets/icons/orderGuide.svg'
import Inventory from '../../assets/icons/inventory.svg'
import Recipe from '../../assets/icons/recipe.svg'
import Ingredients from '../../assets/icons/ingredient.svg'
import RecipeBuilder from '../../assets/icons/recipeBuilder.svg'
import Recipes from '../../assets/icons/recipes.svg'
import Menu from '../../assets/icons/menu.svg'
import MenuBuilder from '../../assets/icons/menuBuilder.svg'
import Sales from '../../assets/icons/sales.svg'
import SalesReports from '../../assets/icons/salesReports.svg'

const StyledSvgIcon = withStyles({
  root: {
    width: '1.20em',
    height: '1.20em',
  },
})(SvgIcon)
//TODO: FIX ICONS
const Icon = ({ icon }) => {
  switch (icon) {
    case 'inventory':
      return <StyledSvgIcon component={Inventory} viewBox="0 0 58 58" />
    case 'warehouse':
      return <StyledSvgIcon component={WarehouseIcon} viewBox="0 0 58 58" />
    case 'barcodeScanner':
      return <StyledSvgIcon component={BarcodeScanner} viewBox="0 0 58 58" />
    case 'reports':
      return <StyledSvgIcon component={InventoryReports} viewBox="0 0 58 58" />
    case 'inventoryList':
      return <StyledSvgIcon component={InventoryList} viewBox="0 0 58 58" />
    case 'orderGuide':
      return <StyledSvgIcon component={OrderGuide} viewBox="0 0 58 58" />
    case 'recipe':
      return <StyledSvgIcon component={Recipe} viewBox="0 0 58 58" />
    case 'ingredients':
      return <StyledSvgIcon component={Ingredients} viewBox="0 0 58 58" />
    case 'recipeBuilder':
      return <StyledSvgIcon component={RecipeBuilder} viewBox="0 0 58 58" />
    case 'recipes':
      return <StyledSvgIcon component={Recipes} viewBox="0 0 58 58" />
    case 'recipeReports':
      return <StyledSvgIcon component={InventoryReports} viewBox="0 0 58 58" />
    case 'menu':
      return <StyledSvgIcon component={Menu} viewBox="0 0 58 58" />
    case 'menuBuilder':
      return <StyledSvgIcon component={MenuBuilder} viewBox="0 0 58 58" />
    case 'sales':
      return <StyledSvgIcon component={Sales} viewBox="0 0 58 58" />
    case 'salesReports':
      return <StyledSvgIcon component={SalesReports} viewBox="0 0 58 58" />
    default:
      return ''
  }
}

export default Icon
