import { Select } from '@radix-ui/themes'
import React from 'react'

export const AssigneeSelect = () => {
  return (
    <Select.Root>
        <Select.Trigger placeholder='Assign...' />
        <Select.Content>
            <Select.Group>
                <Select.Label>Suggestions</Select.Label>
                <Select.Item value="1">Galin Petrov</Select.Item>
            </Select.Group>
        </Select.Content>
    </Select.Root>
  )
}

export default AssigneeSelect