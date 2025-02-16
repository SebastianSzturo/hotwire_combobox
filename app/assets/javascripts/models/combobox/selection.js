import Combobox from "models/combobox/base"
import { wrapAroundAccess } from "helpers"

Combobox.Selection = Base => class extends Base {
  selectOption(event) {
    this._select(event.currentTarget)
    this.close()
  }

  _connectSelection() {
    if (this.hasPrefilledDisplayValue) {
      this._actingCombobox.value = this.prefilledDisplayValue
    }
  }

  _select(option, { force = false } = {}) {
    this._resetOptions()

    if (option) {
      this._markValid()
      this._maybeAutocompleteWith(option, { force })
      this._commitSelection(option, { selected: true })
    } else {
      this._markInvalid()
    }
  }

  _commitSelection(option, { selected }) {
    this._markSelected(option, { selected })

    if (selected) {
      this.hiddenFieldTarget.value = option.dataset.value
      option.scrollIntoView({ block: "nearest" })
    } else {
      this.hiddenFieldTarget.value = null
    }
  }

  _markSelected(option, { selected }) {
    if (this.hasSelectedClass) {
      option.classList.toggle(this.selectedClass, selected)
    }

    option.setAttribute("aria-selected", selected)
  }

  _deselect() {
    const option = this._selectedOptionElement
    if (option) this._commitSelection(option, { selected: false })
  }

  _selectNew(query) {
    this._resetOptions()
    this.hiddenFieldTarget.value = query
    this.hiddenFieldTarget.name = this.nameWhenNewValue
  }

  _selectIndex(index) {
    const option = wrapAroundAccess(this._visibleOptionElements, index)
    this._select(option, { force: true })
  }

  _preselectOption() {
    if (this._hasValueButNoSelection && this._allOptions.length < 100) {
      const option = this._allOptions.find(option => {
        return option.dataset.value === this.hiddenFieldTarget.value
      })

      if (option) this._markSelected(option, { selected: true })
    }
  }

  get _hasValueButNoSelection() {
    return this.hiddenFieldTarget.value && !this._selectedOptionElement
  }
}
