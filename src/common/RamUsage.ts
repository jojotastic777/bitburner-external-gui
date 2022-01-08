export default interface RamUsage {
    local: {
        max:   number
        used:  number
        avail: number
    }

    network: {
        max:   number
        used:  number
        avail: number
    }
}