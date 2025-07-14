import { prisma } from '@/prisma/client'
import { Flex, Table } from '@radix-ui/themes'
import { IssueStatusBadge, Link } from '@/app/components'
import IssueActions from './IssueActions'
import { Issue, Status } from '@prisma/client'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import Pagination from '@/app/components/Pagination'
import IssueTable, { columnNames, IssueQuery } from './IssueTable'

interface Props {
  searchParams: IssueQuery
}

const IssuesPage = async ({searchParams}: Props) => {
    const { status, orderBy } = await searchParams;

    const statuses = Object.values(Status);
    const validStatus = statuses.includes(status) ? status : undefined;
    const order = columnNames
      .includes(orderBy)
      ? { [orderBy]: 'asc' }
      : { createdAt: 'desc' };

    const where = {status};

    const page = parseInt(searchParams.page) || 1;
    const pageSize = 10;
    
    const issues = await prisma.issue.findMany({
      where,
      orderBy: orderBy ? { [orderBy]: 'asc' } : { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    const issueCount = await prisma.issue.count({ where });

    return (
      <Flex direction="column" gap="3">
        <IssueActions />
        <IssueTable searchParams={searchParams} issues={issues} orderBy={orderBy}/>
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={issueCount}
        />
      </Flex>
    )
  }

  export const dynamic = 'force-dynamic'
  
  export default IssuesPage
