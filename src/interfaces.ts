export interface IAlertProps {
    onCancel: () => void;
    onSubmit: () => void;
}

export interface AppContextInterface {
    page: number;
    totalPages: number;
    paginator: number[];
    pageNavHelper: (n: number) => void;
    arrowNavHelper: (num: number, dir?: string, total?: number) => void;
    fetchPagesAmount: (n: number) => void;
    fetchViewed: () => IWatched[];
    notify: boolean;
    beenNotified: () => void;
    notNotified: () => void;
}

export interface IWatched {
    id: number;
    title: string;
}

export interface IPaginationProps {
    currentPage: number;
    pagesArray: number[];
    onPageClick: (page: number) => void;
    onDirClick: (page: number, direction?: string) => void;
}

export interface KataObject {
    id: string;
    name: string;
    slug: string;
    category: string;
    publishedAt: Date;
    approvedAt: Date;
    languages: string[];
    url: string;
    rank:  {
        id: number;
        name: string;
        color: string;
    };
    createdAt: Date;
    createdBy: {
        username: string;
        url: string;
    };
    approvedBy: {
        username: string;
        url: string;
    };
    description: string;
    totalAttempts: number;
    totalCompleted: number;
    totalStars: number;
    voteScore: number;
    tags: string[];
    contributorsWanted: boolean;
    unresolved: {
        issues: number;
        suggestions: number;
    };
}
