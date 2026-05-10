package utils

import "strconv"

func ParseUint(id string) uint {

	value, _ := strconv.Atoi(id)

	return uint(value)
}
