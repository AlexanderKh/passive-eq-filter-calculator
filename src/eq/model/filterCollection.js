import { bellFilters } from './components/bellFilters'
import { lowPassFilters } from './components/lowPassFilters'
import { highPassFilters } from './components/highPassFilters'
import { shelfFilters } from './components/shelfFilters'

export const allFilters = [
    ...bellFilters,
    ...lowPassFilters,
    ...highPassFilters,
    ...shelfFilters,
]

// Check each and bake unique name
allFilters.forEach((filterInfo) => {
    const { category, order, type } = filterInfo.info

    const filterName = filterInfo.klass?.name
    if (!category) {
        console.error(`filter ${filterName} does not have category`)
        return
    }
    if (!order) {
        console.error(`filter ${filterName} does not have order`)
        return
    }
    if (!type) {
        console.error(`filter ${filterName} does not have type`)
        return
    }
    filterInfo.info.name = `${category}-${order}-${type}`
})

export const defaultFilter = allFilters[0]

// Prepare grouped object for UI usage
export const filterGrouping = {}
allFilters.forEach((filterInfo) => {
    const { category, order, type } = filterInfo.info

    filterGrouping[category] ??= {}
    filterGrouping[category][order] ??= {}
    filterGrouping[category][order][type] = filterInfo
})

