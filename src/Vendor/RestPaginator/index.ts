import { getRepository } from "typeorm";

interface paginatorRequest {
    page: number;
    get: number;
    entity: any;
    options?: {
        select?: string[];
        where?: {};
        order?: {};
        relation?: string[];
        withDeleted?: boolean;
        join?: {
            alias: string;
            innerJoin?: {};
            leftJoin?: {};
            innerJoinAndSelect: {};
            leftJoinAndSelect: {};
        };
        cache?: boolean;
    };
}
const paginator = async (obj: paginatorRequest) => {
    const { page, get, entity, options } = obj;
    const total: number = await getRepository(entity).count({
        ...options,
    });
    let mod: number = total % get != 0 ? 1 : 0;
    let totalPage: number = Math.floor(total / get) + mod;
    let currentPage: number = page >= totalPage ? totalPage : page;
    let nextPage: number = page >= totalPage ? null : page + 1;
    let prevPage: number = page <= 1 ? null : page - 1;
    let skip: number = get * page - get;
    let take: number = get;
    const data = await getRepository(entity).find({
        skip,
        take,
        ...options,
    });
    let paginatorInfo = {
        data,
        currentPage,
        nextPage,
        prevPage,
        totalPage,
        count: total,
    };
    return paginatorInfo;
};

export default paginator;