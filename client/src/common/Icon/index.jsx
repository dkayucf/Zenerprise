/* eslint-disable react/prop-types */
import * as React from 'react'
import { SvgIcon } from '@mui/material'
import withStyles from '@mui/styles/withStyles'
import { ReactComponent as WarehouseIcon } from '../../assets/icons/warehouse.svg'
import { ReactComponent as BarcodeScanner } from '../../assets/icons/barcodeScanner.svg'
import { ReactComponent as InventoryReports } from '../../assets/icons/inventoryReports.svg'
import { ReactComponent as InventoryList } from '../../assets/icons/inventoryList.svg'
import { ReactComponent as OrderGuide } from '../../assets/icons/orderGuide.svg'
import { ReactComponent as Inventory } from '../../assets/icons/inventory.svg'
import { ReactComponent as Recipe } from '../../assets/icons/recipe.svg'
import { ReactComponent as Ingredients } from '../../assets/icons/ingredient.svg'
import { ReactComponent as RecipeBuilder } from '../../assets/icons/recipeBuilder.svg'
import { ReactComponent as Recipes } from '../../assets/icons/recipes.svg'
import { ReactComponent as Menu } from '../../assets/icons/menu.svg'
import { ReactComponent as MenuBuilder } from '../../assets/icons/menuBuilder.svg'
import { ReactComponent as Sales } from '../../assets/icons/sales.svg'
import { ReactComponent as SalesReports } from '../../assets/icons/salesReports.svg'

const StyledSvgIcon = withStyles({
  root: {
    width: '1.20em',
    height: '1.20em',
  },
})(SvgIcon)

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
